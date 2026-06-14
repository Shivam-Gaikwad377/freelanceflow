"use client";
import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    return (
        <div>
            <nav className="bg-surface/80 dark:bg-surface/80 fixed top-4 inset-x-4 max-w-container-max mx-auto backdrop-blur-md border border-outline-variant/30 shadow-lg z-50 rounded-full h-20 flex items-center px-gutter transition-all duration-300 entrance">
                <div className="flex justify-between items-center w-full">
                    <div className="text-headline-sm font-headline-sm font-bold text-primary hover:opacity-90 transition-opacity cursor-pointer">
                        FreelanceFlow
                    </div>
                    <div className="hidden md:flex items-center justify-center gap-lg">
                        <a
                            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                            href="#home"
                        >
                            Home
                        </a>
                        <a
                            className="font-body-md text-body-md text-on-surface-variant  hover:text-primary transition-colors"
                            href="#testimonials"
                        >
                            About
                        </a>
                        <a
                            className="font-body-md text-body-md text-on-surface-variant  hover:text-primary transition-colors"
                            href="#features"
                        >
                            Features
                        </a>
                    </div>
                    <div className="flex items-center gap-md">
                        <button onClick={() => router.push("/login")} className="hidden md:block font-body-md cursor-pointer text-body-md text-primary hover:opacity-90 transition-opacity active:scale-95 duration-200 py-2 px-4 rounded-full">
                            Login
                        </button>
                        <button onClick={() => router.push("/register")} className="bg-primary cursor-pointer text-on-primary font-label-md text-label-md py-3 px-6 rounded-full hover:opacity-90 transition-opacity active:scale-95 duration-200 soft-shadow">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
