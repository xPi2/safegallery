import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const Gallery: NextPage = () => {
    const safeService = new SafeServiceClient('https://safe-transaction.gnosis.io');
    const router = useRouter();
    let safeAddress: string = router.query.pid ? router.query.pid as string : "";
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

    interface FrameProps {
        title: string,
        text: string,
        image: string,
        href: string
    }

    interface collectMetadata {
        name: string | null,
        description: string | null,
        image: string | null,
    }

    interface Collectible {
        address: string,
        description: string,
        id: string,
        imageUri: string,
        metadata: collectMetadata,
        name: string | null,
        uri: string | null,
    }

    const [safeCollectibles, setSafeCollectibles] = useState<Array<Collectible> | null>(null);

    const fetchSafeCollectibles = async (address: string | undefined) => {
        if (address) {
            console.log(address);
            safeService.getCollectibles(address).then(collectibles => {
                console.log(collectibles);
                let filteredCollectibles = collectibles.filter(collectible => {
                    let mediaUrl = collectible.imageUri || collectible.metadata.image;
                    // Filter mp4 IPFS files // TODO: Support IPFS mp4 files
                    mediaUrl = mediaUrl?.includes('ipfs') && mediaUrl?.endsWith('mp4') ? "" : mediaUrl;
                    // Filter ENS // TODO: Replace for something
                    mediaUrl = mediaUrl?.endsWith('ENS.png') ? "" : mediaUrl;

                    if (mediaUrl) {
                        return { ...collectible, imageUri: mediaUrl };
                    }
                });
                console.log(filteredCollectibles);
                setSafeCollectibles(filteredCollectibles);
            }).catch(e => { console.log(e.message) });
        }
    }

    useEffect(() => {
        if (safeAddress.endsWith('eth')) {
            web3.eth.ens.getAddress(safeAddress).then((address) => {
                safeAddress = address;
                fetchSafeCollectibles(safeAddress);
                });
        } else {
            fetchSafeCollectibles(safeAddress);
        }
    }, [safeAddress]);

    function Frame(props: FrameProps) {
        return (
            <div id="collectible" className="grid max-w-md content-center">
                <a href={props.href} className="border-black border-4 drop-shadow-lg bg-white">
                    <img src={props.image} className="border border-black" />
                </a>
                <div id="details">
                    {props.title}
                </div>
            </div>
        );
    }

    function safeUrl(url: string) {
        if (url) {
            return url.replace("ipfs://", "https://ipfs.io/ipfs/").replace("ipfs/ipfs/", "ipfs/");
        }
    }

    function marketplaceUrl(collectible: Collectible) {
        if (collectible.address && collectible.id) {
            return `https://www.gem.xyz/asset/${collectible.address}/${collectible.id}`
        }
    }

    function Collectibles() {
        return safeCollectibles?.map((collectible) => {
            let safeMediaUrl = safeUrl(collectible.imageUri);
            let href = marketplaceUrl(collectible);
            return (
                <Frame
                    title={collectible.metadata.name || "xxx"}
                    text={collectible.metadata.description || ""}
                    image={safeMediaUrl || "#"}
                    href={href || "#"}
                />
            )
        }
        )
    }

    function Gallery() {
        let minCols = safeCollectibles? Math.min(3, safeCollectibles.length) : 1;
        return (
            <div className={"place-items-center gap-10 lg:gap-6 px-10 z-10 grid md:grid-cols-1" + ` lg:grid-cols-${minCols}`}>
                {Collectibles()}
            </div>
        )
    }

    return (
        <div className="min-h-screen w-100 mx-auto grid bg-gray-50 -z-10">
            <Head>
                <title>SafeGallery</title>
                <meta name="description" content="Collectibles gallery powered by GnosisSafe" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto py-20 grid grid-cols-1 content-center">
                {Gallery()}
            </main>

            <footer className="fixed bottom-0 z-0 border-t-2 border-black w-screen p-5 font-sans grid grid-cols-2 place-content-between">
                <span>Safe<span className="font-bold">Gallery</span></span>
                <a
                    href="https://goldmandao.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-right"
                >
                    By <span className="font-bold">GoldmanDAO<span className="text-[gold]">|</span></span>
                </a>
            </footer>
        </div>
    )
}

export default Gallery
