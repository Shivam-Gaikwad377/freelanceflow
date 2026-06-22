"use client"
import React from 'react'

const AddProject = () => {
  return (
    <div className="lg:pl-64 pt-24 pb-20 px-4 md:px-xl min-h-screen">
        <div className="max-w-4xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
                <div>
                    <a className="inline-flex items-center gap-xs text-primary hover:underline font-label-md mb-xs transition-all"
                        href="#">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Projects
                    </a>
                    <h1 className="font-headline-lg text-headline-lg md:text-headline-lg-mobile text-on-surface">Add New
                        Project</h1>
                </div>
            </div>
            
            <div className="glass-card rounded-xl shadow-sm overflow-hidden mb-xl">
                <div className="p-lg md:p-xl">
                    <form action="#" className="space-y-lg">
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface-variant block">Project Title
                                    <span className="text-error">*</span></label>
                                <input
                                    className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                                    placeholder="e.g., Website Redesign" required={true} type="text" />
                            </div>
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface-variant block">Client</label>
                                <select
                                    className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md appearance-none">
                                    <option disabled={true} selected={true} value="">Select a client...</option>
                                    <option value="acme">Acme Corp</option>
                                    <option value="globex">Globex Inc.</option>
                                    <option value="soylent">Soylent Corp</option>
                                </select>
                            </div>
                        </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface-variant block">Total
                                    Budget</label>
                                <div className="flex">
                                    <span
                                        className="inline-flex items-center px-md rounded-l-lg border border-r-0 border-outline bg-surface-container-low text-on-surface-variant text-body-sm">$</span>
                                    <input
                                        className="flex-1 min-w-0 bg-surface border border-outline rounded-r-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                                        placeholder="0.00" type="number" />
                                </div>
                            </div>
                            <div className="space-y-xs">
                                <label
                                    className="font-label-md text-label-md text-on-surface-variant block">Deadline</label>
                                <input
                                    className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                                    type="date" />
                            </div>
                        </div>
                      
                        <div className="space-y-xs">
                            <label className="font-label-md text-label-md text-on-surface-variant block">Description</label>
                            <textarea
                                className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                                placeholder="Brief overview of project goals..." rows={4}></textarea>
                        </div>
                        
                        <div className="space-y-md pt-md">
                            <label className="font-label-md text-label-md text-on-surface-variant block">Initial
                                Status</label>
                            <div className="flex items-center gap-xl">
                                <label className="flex items-center gap-md cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input checked={true}
                                            className="peer h-5 w-5 appearance-none rounded-full border border-outline checked:border-primary focus:ring-primary transition-all"
                                            name="status" type="radio" />
                                        <div
                                            className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform">
                                        </div>
                                    </div>
                                    <span
                                        className="text-body-md text-on-surface group-hover:text-primary transition-colors">To
                                        Do</span>
                                </label>
                                <label className="flex items-center gap-md cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            className="peer h-5 w-5 appearance-none rounded-full border border-outline checked:border-primary focus:ring-primary transition-all"
                                            name="status" type="radio" />
                                        <div
                                            className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform">
                                        </div>
                                    </div>
                                    <span
                                        className="text-body-md text-on-surface group-hover:text-primary transition-colors">In
                                        Progress</span>
                                </label>
                                <label className="flex items-center gap-md cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            className="peer h-5 w-5 appearance-none rounded-full border border-outline checked:border-primary focus:ring-primary transition-all"
                                            name="status" type="radio" />
                                        <div
                                            className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform">
                                        </div>
                                    </div>
                                    <span
                                        className="text-body-md text-on-surface group-hover:text-primary transition-colors">Completed</span>
                                </label>
                            </div>
                        </div>
                        
                        <div
                            className="flex items-center justify-end gap-md pt-lg border-t border-outline-variant/30 mt-xl">
                            <button
                                className="px-xl py-[12px] text-primary font-label-md hover:bg-surface-container transition-colors rounded-lg"
                                type="button">
                                Cancel
                            </button>
                            <button
                                className="bg-primary text-on-primary px-xl py-[12px] rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
                                type="submit">
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg opacity-80">
                <div
                    className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                    <span className="material-symbols-outlined text-primary">timer</span>
                    <h3 className="font-label-md text-on-surface">Time Tracking</h3>
                    <p className="text-body-sm text-on-surface-variant">Log billable hours directly against this project
                        seamlessly.</p>
                </div>
                <div
                    className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    <h3 className="font-label-md text-on-surface">Budget Alerts</h3>
                    <p className="text-body-sm text-on-surface-variant">Get notified when you approach your set budget
                        limits.</p>
                </div>
                <div
                    className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                    <span className="material-symbols-outlined text-primary">flag</span>
                    <h3 className="font-label-md text-on-surface">Milestone Sync</h3>
                    <p className="text-body-sm text-on-surface-variant">Automatically generate invoices based on milestone
                        completion.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddProject