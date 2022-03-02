import type { NextPage } from 'next'
import Head from 'next/head'
import Web3 from 'web3';
import { NFT } from '../../../abis';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import FramedImage from '../../../components/FramedImage';

const Token: NextPage = () => {
    const router = useRouter();
    const axios = require('axios');
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const galleryAddress: string = router.query.address ? router.query.address as string : "";
    const tokenAddress: string = router.query.token ? router.query.token as string : "";
    const tokenId: string = router.query.id ? router.query.id as string : "";
    const galleryUrl = `/${galleryAddress}`;

    interface Collectible {
        address: string,
        id: string,
        name: string | null,
        description: string,
        image: string,
    }

    const [collectible, setCollectible] = useState<Collectible | null>(null);

    const fetchCollectible = async () => {
        if (!tokenAddress || !tokenId) {
            return
        }
        let token = new web3.eth.Contract(NFT, tokenAddress);

        let name = await token.methods.name().call();
        let tokenURI = await token.methods.tokenURI(tokenId).call();
        console.log(name);
        console.log(tokenURI);
        axios.get(tokenURI).then(function(response) {
            setCollectible(
                {
                    address: tokenAddress,
                    id: tokenId,
                    name: response.data.name,
                    description: response.data.description,
                    image: safeUrl(response.data.image)
                });
        })
    }

    useEffect(() => {
        fetchCollectible();
    }, [tokenAddress, tokenId]);

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

    function CollectibleDisplay() {
        if (collectible) {
            return (
                <div className="grid md:grid-cols-1 lg:grid-cols-2">
                    <div>
                        <FramedImage src={collectible.image}/>
                    </div>
                    <div className="content-center">
                        <div className="p-5 bg-gray-50">
                            <div className="text-2xl font-bold">{collectible?.name}</div>
                            <div className="my-10">{collectible?.description}</div>
                            <a className="my-10 underline" href={marketplaceUrl(collectible)}>See on the marketplace</a>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="min-h-screen w-100 mx-auto grid bg-gray-50 -z-10">
            <Head>
                <title>SafeGallery</title>
                <meta name="description" content="Collectibles gallery powered by GnosisSafe" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto py-20 p-5 lg:p-20 grid grid-cols-1 content-center z-10">
                <div className="absolute top-10">
                    <a href={galleryUrl}>← Back to gallery</a>
                </div>
                {CollectibleDisplay()}
            </main >

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
        </div >
    )
}

export default Token
