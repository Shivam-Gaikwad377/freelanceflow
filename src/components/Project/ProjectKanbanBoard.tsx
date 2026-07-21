"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/Project/ProjectCard";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { useDelete } from "@/app/hooks/useDelete";
import { toast } from "sonner";
import {Project} from "@/types/Model.types";
type Status = "open" | "in progress" | "completed";

const STATUS_STYLES: Record<Status, string> = {
  open: "w-2 h-2 rounded-full bg-outline",
  "in progress": "w-2 h-2 rounded-full bg-primary animate-pulse",
  completed: "w-2 h-2 rounded-full bg-secondary",
};

const LIMIT = 10;

const ProjectKanbanBoard = ({ status }: { status: Status }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // initial skeleton
  const [loadingMore, setLoadingMore] = useState(false); // bottom spinner
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { deleteItem: deleteProject, isDeleting: isDeletingProject } = useDelete<Project>({
    resource: "projects",
    setItems: setProjects,
    successMessage: "Project deleted successfully",
    errorMessage: "Failed to delete project",
  });

  // ── Core fetch — page 1 replaces, page 2+ appends ──────────────────────
  const fetchProjects = useCallback(
    async (pageNum: number) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const offset = (pageNum - 1) * LIMIT;

        const res = await axios.get(
          `/api/projects?status=${status}&offset=${offset}&limit=${LIMIT}`
        );

        const { projects: incoming, total } = res.data.data;
        const totalPages = Math.ceil(total / LIMIT);

        setProjects((prev) => {
          if (pageNum === 1) return incoming;

          // Defensively remove any duplicates from incoming before appending
          const existingIds = new Set(prev.map((p) => p._id));
          const newProjects = incoming.filter(
            (p: any) => !existingIds.has(p._id)
          );

          return [...prev, ...newProjects];
        });

        setTotal(total);
        setPage(pageNum);
        setHasMore(pageNum < totalPages);
      } catch (err) {
        setError("Failed to load projects.");
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [status]
  );

  // Initial load (also re-runs if status ever changes)
  useEffect(() => {
    setPage(1);
    setProjects([]);
    setHasMore(true);
    fetchProjects(1);
  }, [fetchProjects]);

  // ── Infinite scroll wiring ──────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchProjects(page + 1);
  }, [loadingMore, hasMore, page, fetchProjects]);

  const setSentinel = useInfiniteScroll(loadMore); // ← returns a ref setter

  return (
    <div className="flex-1 flex flex-col gap-md kanban-col min-w-[1/3] bg-surface-container-low/50 max-h-screen rounded-xl p-md border border-outline-variant/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-sm">
        <h3 className="text-label-md font-label-md text-on-surface uppercase tracking-wider flex items-center gap-sm">
          <span className={STATUS_STYLES[status]} />
          {status}
        </h3>
        <span className="bg-surface border border-outline-variant/50 text-on-surface-variant text-label-sm px-2 py-1 rounded-full">
          {total}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex flex-col gap-md overflow-y-auto scrollbar-hide pr-1 pb-4">
        {/* Initial skeleton */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-surface-container animate-pulse"
            />
          ))}

        {/* Error */}
        {!loading && error && (
          <p className="text-error text-body-sm text-center py-4">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && projects.length === 0 && (
          <p className="text-on-surface-variant text-body-sm text-center py-4">
            No {status} projects.
          </p>
        )}

        {/* Cards */}
        {!loading &&
          !error &&
          projects.map((project) => (
            <ProjectCard
              key={project?._id}
              title={project.title}
              client={project.client}
              deadline={new Date(project.deadline).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
              budget={project.budget}
              status={project.status}
              onClick={() => router.push(`/projects/${project._id}`)}
              onDelete={() => deleteProject(project._id)}
              projectId={project._id}
              burnRate={project.burnRate}
            />
          ))}

        {/* ✅ Sentinel — hook watches this div */}
        {hasMore && <div ref={setSentinel} />}

        {/* Pagination spinner */}
        {loadingMore && (
          <div className="h-8 rounded-xl bg-surface-container animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default ProjectKanbanBoard;
