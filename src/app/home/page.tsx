"use client"
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="antialiased flex flex-col min-h-screen p-0 m-0 relative pt-20 overflow-x-hidden">
            <div className="flex flex-col items-center justify-center min-h-screen  ">
                <div
                    aria-hidden="true"
                    className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-30"
                >
                    <Image
                        fill
                        sizes="100vw"
                        alt=""
                        className="w-full h-full object-cover scale-110 blur-2xl"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5cLUWEf_p8Gvu43B9igYz_nNUVekCCOffUwGQTPRoPH5Dv-LyuZP1lV7BxAY8euVUlOgn4TfdWe5k3sWh1W2hm8fcuRC1gDae0tFFrddkytYuucosY2ZSo3qJYZBnY3UuHH9H3N7LBryRFwLhwmQsmEtYyNyxht3ARorldYHsmRYjfsev0gT3ksHXTeP8rmn9_418j3z64-QprUK7TE-jHrf_X6Eo_27DgqeDSWzTazURLWHqM9m_U5i32sHArWwNdA3blQ_BK_4m"
                    />
                </div>
                <Navbar />
                <Hero />
                <Features />
                <Footer />


            </div>
        </div>
    );
}
