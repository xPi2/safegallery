import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SafeServiceClient, { SafeInfoResponse } from '@gnosis.pm/safe-service-client'
import { useEffect, useState } from 'react';

const Home: NextPage = () => {

    const handleKey = (e: SyntheticBaseEvent) => {
        if(e.key === "Enter") {
            console.log(e);
        }
    }

    return (
        <div className="h-screen w-screen mx-auto grid bg-gray-50 -z-10">
            <Head>
                <title>SafeGallery</title>
                <meta name="description" content="Collectibles gallery powered by GnosisSafe" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto py-5 grid grid-cols-1 content-center">
                <div className="my-10 text-center text-5xl lg:text-4xl mx-10 md:mx-5">
                    <span>Safe<span className="text-6xl lg:text-5xl">Gallery</span></span>
                    <p className="mt-5 text-lg">The gallery for Gnosis Safes decentralized collections</p>
                    <p className="my-2 text-lg">
                    Safe:
                    <input onKeyDown={handleKey} className="appearance-none focus:outline-none bg-transparent border-b border-black"></input>
                    </p>
                </div>
            </main>

            <footer className="fixed bottom-0 z-0 border-t-2 border-black w-screen p-5 text-right font-sans">
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
