"use client";
import React from "react";
import { useState, useEffect } from "react";
import ProjectKanbanBoard from "@/components/ProjectKanbanBoard";
import useDebounce from "@/app/hooks/useDebounce";
import ApiResponse from "@/types/ApiResponse";
import axios from "axios";
import ProjectCard from "@/components/ProjectCard";
import { useRouter } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";

const page = () => {
  const status = ["open", "in progress", "completed"] as const;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const limit = 10;
  const [projects, setProjects] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const router = useRouter();
  useEffect(() => {
    setOffset(0);
  }, [debouncedSearchTerm]);
  
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError
  } = useFetch(`/api/projects?offset=${offset}&limit=${limit}&search=${debouncedSearchTerm}`);

  useEffect(() => {
    if (projectData ) {
      setProjects(projectData.projects);
    }
  }, [projectData]);


  return (
    <div className="px-xxl py-xl flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl">
        <div className="flex justify-between items-center gap-md w-full">
          <div>
            <h2 className="text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">
              Projects
            </h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
              Track your active engagements.
            </p>
          </div>
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64 transition-all"
              placeholder="Search projects..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1  pb-lg -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
        <div className="flex gap-gutter w-full h-full items-center">
          {debouncedSearchTerm ? (
            projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                {projects.map((project) => (
                  <div
                    key={project?._id}
                    onClick={() => router.push(`/projects/${project._id}`)}
                  >
                    <ProjectCard
                      key={project?._id}
                      title={project.title}
                      client={project.client}
                      deadline={project.deadline}
                      budget={project.budget}
                      status={project.status}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-on-surface-variant text-center mt-xl">
                No projects match &quot;{debouncedSearchTerm}&quot;.
              </p>
            )
          ) : (
            <div className="flex gap-gutter w-full h-full items-center">
              {status.map((s) => (
                <ProjectKanbanBoard key={s} status={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
