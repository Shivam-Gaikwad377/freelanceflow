"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "@/components/ProjectCard";
import ProjectKanbanBoard from "@/components/ProjectKanbanBoard";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";

const page = () => {
    const status = ["open", "in progress", "completed"] as const;
  return (
    <div className="text-on-background  font-body-md bg-background antialiased selection:bg-primary selection:text-on-primary">
      <TopNavbar />
      <div className="flex h-screen pt-16 md:pt-0">
        <Sidebar />

        <main className="flex-1 md:ml-64  bg-background px-xxl py-xl  flex flex-col h-full w-full max-w-400 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl">
            <div>
              <h2 className="text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">
                Projects
              </h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                Track your active engagements.
              </p>
            </div>
            
          </div>

          <div className="flex-1  pb-lg -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
            <div className="flex gap-gutter min-w-225 h-full items-start">
                {status.map((s) => (
                    
                        <ProjectKanbanBoard key={s} status={s} />
                    
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
