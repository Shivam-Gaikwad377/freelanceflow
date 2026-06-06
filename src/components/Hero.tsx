import React from "react";

const Hero = () => {
    return (
        <div>
            <header className="relative pt-xxl pb-xxl px-gutter md:px-lg text-center overflow-hidden flex flex-col justify-center items-center">
                <div className="absolute inset-0 hero-pattern pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl mx-auto space-y-lg">
                    <h1 className="font-jakarta text-display text-on-surface tracking-tight leading-tight entrance delay-100">
                        Manage your freelance business in flow
                    </h1>
                    <p className="font-inter text-body-lg text-on-surface-variant max-w-2xl mx-auto entrance delay-200">
                        The minimalist workspace designed for solo
                        professionals. Seamlessly manage clients, projects, and
                        invoices without the clutter.
                    </p>
                    <div className="pt-md flex flex-col sm:flex-row items-center justify-center gap-md entrance delay-300">
                        <button className="bg-primary font-jakarta text-on-primary font-label-md text-label-lg py-4 px-8 rounded-full hover:opacity-90 hover:scale-105 transition-all active:scale-95 duration-200 ambient-shadow w-full cursor-pointer sm:w-auto">
                            Get Started
                        </button>
                        <button className="bg-surface-container font-jakarta cursor-pointer text-on-surface font-label-lg text-label-lg py-4 px-8 rounded-full hover:bg-surface-variant hover:scale-105 transition-all duration-200 active:scale-95 w-full sm:w-auto border border-outline-variant">
                            Log in
                        </button>
                    </div>
                </div>

                <div className="mt-xxl max-w-5xl mx-auto w-full px-gutter entrance delay-400">
                    <div className="relative w-full aspect-[16/10] bg-surface-container-lowest rounded-xl border border-outline-variant/30 ambient-shadow overflow-hidden flex flex-col">
                        <div className="h-12 border-b border-outline-variant/20 flex items-center px-lg bg-surface/50 gap-sm shrink-0">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            <div className="ml-4 flex-1">
                                <div className="h-6 w-64 mx-auto bg-surface-variant/50 rounded-md flex items-center justify-center px-3 gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-outline">
                                        lock
                                    </span>
                                    <div className="h-2 w-32 bg-outline-variant/50 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-64 border-r border-outline-variant/20 bg-surface-bright p-md hidden sm:flex flex-col gap-lg">
                                <div className="flex items-center gap-sm mb-sm">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-on-primary text-[18px]">
                                            stream
                                        </span>
                                    </div>
                                    <div className="h-4 w-24 bg-on-surface-variant/20 rounded"></div>
                                </div>
                                <div className="space-y-sm">
                                    <div className="flex items-center gap-sm p-sm bg-primary/10 rounded-md text-primary">
                                        <span className="material-symbols-outlined text-[20px]">
                                            dashboard
                                        </span>
                                        <div className="h-3 w-20 bg-primary/40 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-sm p-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[20px]">
                                            group
                                        </span>
                                        <div className="h-3 w-16 bg-outline-variant/50 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-sm p-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[20px]">
                                            folder
                                        </span>
                                        <div className="h-3 w-24 bg-outline-variant/50 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-sm p-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[20px]">
                                            receipt_long
                                        </span>
                                        <div className="h-3 w-20 bg-outline-variant/50 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-surface-container-lowest p-lg overflow-y-auto flex flex-col gap-lg">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <div className="h-6 w-48 bg-on-surface/20 rounded"></div>
                                        <div className="h-3 w-64 bg-on-surface-variant/20 rounded"></div>
                                    </div>
                                    <div className="h-10 w-32 bg-primary text-on-primary rounded-full flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">
                                            add
                                        </span>
                                        <div className="h-3 w-16 bg-on-primary/50 rounded"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                                    <div className="bg-surface p-md rounded-xl border border-outline-variant/20">
                                        <div className="flex items-center justify-between mb-sm">
                                            <div className="h-3 w-24 bg-on-surface-variant/40 rounded"></div>
                                            <span className="material-symbols-outlined text-primary text-[20px]">
                                                account_balance_wallet
                                            </span>
                                        </div>
                                        <div className="h-8 w-32 bg-on-surface/30 rounded mb-2"></div>
                                        <div className="h-2 w-16 bg-secondary-container/50 rounded"></div>
                                    </div>
                                    <div className="bg-surface p-md rounded-xl border border-outline-variant/20">
                                        <div className="flex items-center justify-between mb-sm">
                                            <div className="h-3 w-24 bg-on-surface-variant/40 rounded"></div>
                                            <span className="material-symbols-outlined text-tertiary text-[20px]">
                                                pending_actions
                                            </span>
                                        </div>
                                        <div className="h-8 w-20 bg-on-surface/30 rounded mb-2"></div>
                                        <div className="h-2 w-24 bg-outline-variant/50 rounded"></div>
                                    </div>
                                    <div className="bg-surface p-md rounded-xl border border-outline-variant/20">
                                        <div className="flex items-center justify-between mb-sm">
                                            <div className="h-3 w-24 bg-on-surface-variant/40 rounded"></div>
                                            <span className="material-symbols-outlined text-secondary text-[20px]">
                                                check_circle
                                            </span>
                                        </div>
                                        <div className="h-8 w-24 bg-on-surface/30 rounded mb-2"></div>
                                        <div className="h-2 w-20 bg-secondary-container/50 rounded"></div>
                                    </div>
                                </div>

                                <div className="bg-surface rounded-xl border border-outline-variant/20 flex-1 flex flex-col">
                                    <div className="p-md border-b border-outline-variant/20">
                                        <div className="h-5 w-32 bg-on-surface/20 rounded"></div>
                                    </div>
                                    <div className="p-md space-y-md">
                                        <div className="flex items-center justify-between p-sm hover:bg-surface-variant/30 rounded-lg">
                                            <div className="flex items-center gap-md">
                                                <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary">
                                                        person
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="h-4 w-40 bg-on-surface/30 rounded"></div>
                                                    <div className="h-3 w-24 bg-on-surface-variant/40 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 w-20 bg-secondary-container/30 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-sm hover:bg-surface-variant/30 rounded-lg">
                                            <div className="flex items-center gap-md">
                                                <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-tertiary">
                                                        work
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="h-4 w-48 bg-on-surface/30 rounded"></div>
                                                    <div className="h-3 w-32 bg-on-surface-variant/40 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 w-24 bg-surface-variant rounded-full"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-sm hover:bg-surface-variant/30 rounded-lg">
                                            <div className="flex items-center gap-md">
                                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-secondary">
                                                        payments
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="h-4 w-32 bg-on-surface/30 rounded"></div>
                                                    <div className="h-3 w-20 bg-on-surface-variant/40 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 w-24 bg-secondary-container/30 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Hero;
