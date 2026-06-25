"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

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

  // ── Core fetch — page 1 replaces, page 2+ appends ──────────────────────
  const fetchProjects = useCallback(
    async (pageNum: number) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        // Calculate the offset based on the current page
        const offset = (pageNum - 1) * LIMIT;

        // Send 'offset' instead of 'page'
        const res = await axios.get(
          `/api/projects?status=${status}&offset=${offset}&limit=${LIMIT}`
        );

        // Map 'projects' to 'incoming', and calculate 'totalPages' manually
        const { projects: incoming, total } = res.data.data;
        const totalPages = Math.ceil(total / LIMIT);

        setProjects((prev) =>
          pageNum === 1 ? incoming : [...prev, ...incoming]
        );
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

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col gap-md kanban-col bg-surface-container-low/50 max-h-screen rounded-xl p-md border border-outline-variant/20">
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
