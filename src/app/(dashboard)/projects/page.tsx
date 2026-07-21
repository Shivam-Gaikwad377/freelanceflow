"use client";
import React from "react";
import { useState, useEffect } from "react";
import ProjectKanbanBoard from "@/components/Project/ProjectKanbanBoard";
import useDebounce from "@/app/hooks/useDebounce";
import { Project } from "@/types/Model.types";
import ProjectCard from "@/components/Project/ProjectCard";
import { useRouter } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";


const page = () => {
  const status = ["open", "in progress", "completed"] as const;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const limit = 10;
  const [projects, setProjects] = useState<Project[]>([]);
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
    if (projectData) {
      setProjects(projectData.projects);
    }
  }, [projectData]);


  return (
    <div className=" overflow-y-auto bg-background p-margin-mobile md:p-xxl flex flex-col h-full w-full  mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl">
        <div>
          <h2
            className="text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface"
          >
            Projects
          </h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
            Track your active engagements.
          </p>
        </div>

        {/* was `hidden sm:block` — full-width on mobile, fixed width from sm up */}
        <div className="relative w-[50%] sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full transition-all"
            placeholder="Search projects..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* min-h-0 is required here: this is a flex-1 child in a flex-col parent,
      and without it, flex items default to min-height: auto, which stops
      overflow-x-auto below from ever kicking in */}
      <div className="flex-col md:flex-1 min-h-0 pb-lg -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
        {debouncedSearchTerm ? (
          projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {projects.map((project) => (
                <div
                  key={project._id.toString()}
                  onClick={() => router.push(`/projects/${project._id}`)}
                >
                  <ProjectCard
                    title={project.title}
                    client={project.client}
                    deadline={new Date(project.deadline).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    budget={project.budget}
                    status={project.status}
                    projectId={project._id.toString()}
                    burnRate={project.burnRate}
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
          // items-center removed (was breaking the h-full stretch),
          // overflow-x-auto added so columns scroll instead of squeezing
          <div className="md:flex-row flex flex-col gap-gutter w-full h-full overflow-x-auto">
            {status.map((s) => (
              <ProjectKanbanBoard key={s} status={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
