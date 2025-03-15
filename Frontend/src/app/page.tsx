"use client";
import React from 'react';
import Link from 'next/link';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Spotlight } from '@/components/ui/Spotlight';
import { Button } from '@/components/ui/moving-border';

function HomePage() {
    return (
        <WavyBackground className=" w-fit pb-50">
            {/* <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden"> */}
                <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        AirVison <br />
                    </h1>
                    <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                        AirVison is a platform that provides real-time air quality data and pollution prediction for your location. It also provides guidelines to help you stay safe and healthy.
                    </p>
                    <div className='p-4 flex items-center justify-center'>
                        <Link href="/signin">
                            <Button
                                borderRadius="2.5rem"
                                className="bg-white dark:bg-zinc-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                            >
                                Try it Out!
                            </Button>
                        </Link>
                    </div>
                </div>
            {/* </div> */}
        </WavyBackground>
    )
}

export default HomePage;
