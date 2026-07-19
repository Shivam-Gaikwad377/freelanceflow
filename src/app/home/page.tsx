"use client"
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features"
import Gradient from "../../../public/Gradient.png"
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
                        src={Gradient}
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
