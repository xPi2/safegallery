import type { NextPage } from 'next'
import Head from 'next/head'
import SafeServiceClient, { SafeInfoResponse } from '@gnosis.pm/safe-service-client'
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
    const safeService = new SafeServiceClient('https://safe-transaction.gnosis.io');
    const safeAddress: string = "0xF5c27c6fE782cbB5c85989ea3e75754748153459"; // TODO: Parametrize safe address

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
        id: string,
        metadata: collectMetadata,
        name: string | null,
        uri: string | null,
    }

    const [safeCollectibles, setSafeCollectibles] = useState<Array<Collectible> | null>(null);

    const fetchSafeCollectibles = async (address: string) => {
        let collectibles = await safeService.getCollectibles(address);
        setSafeCollectibles(collectibles);
        console.log(collectibles);
    }

    useEffect(() => {
        fetchSafeCollectibles(safeAddress);
    }, []);

    function Frame(props: FrameProps) {
        return (
            <div className="grid max-w-md content-center">
                <div className="border-black border-4 drop-shadow-lg bg-white">
                <img src={props.image} className="border border-black"/>
                </div>
            </div>
        );
    }

    function safeUrl(url: string) {
        if (url) {
            return url.replace("ipfs://", "https://ipfs.io/ipfs/").replace("ipfs/ipfs/", "ipfs/");
        }
    }

    function Collectibles() {
        return safeCollectibles?.map((collectible) => {
            let mediaUrl = collectible.metadata.image;
            // Filter mp4 IPFS files // TODO: Support IPFS mp4 files
            mediaUrl = mediaUrl?.startsWith('ipfs') && mediaUrl?.endsWith('mp4') ? "" : mediaUrl;
            // Filter ENS // TODO: Replace for something
            mediaUrl = mediaUrl?.endsWith('ENS.png') ? "" : mediaUrl;
            if (mediaUrl) {
                let safeMediaUrl = safeUrl(mediaUrl);
                return (
                    <Frame
                        title={collectible.metadata.name || "xxx"}
                        text={collectible.metadata.description || ""}
                        image={safeMediaUrl || "#"}
                        href={collectible.uri || "#"}
                    />
                )
            }
        })
    }

    return (
        <div className="h-100 w-100 mx-auto grid bg-gray-50 -z-10">
            <Head>
                <title>SafeGallery</title>
                <meta name="description" content="Collectibles gallery powered by GnosisSafe" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto py-5 grid grid-cols-1 content-center">
                <div className="my-10 text-left text-5xl lg:text-4xl mx-10 md:mx-5">
                    <span>Safe<span className="text-6xl lg:text-5xl">Gallery</span></span>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 place-items-center gap-10 lg:gap-6 px-10 z-10">
                    {Collectibles()}
                </div>
                <div className="my-10"></div>
            </main>

            <footer className="fixed bottom-0 z-0 border-t-2 border-black w-screen p-5 text-right">
                <a
                    href="https://goldmandao.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    By <span className="font-bold">GoldmanDAO<span className="text-[gold]">|</span></span>
                </a>
            </footer>
        </div>
    )
}

export default Home
