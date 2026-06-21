import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "@/components/ProjectCard";

// ── Types ──────────────────────────────────────────────────
type Status = "open" | "in progress" | "completed";

interface Project {
  id: string;
  title: string;
  client: string;
  deadline: string;
  budget: number;
  status: Status;
}

interface ApiResponse {
  data: Project[];
  total: number;
  offset: number;
}

interface ProjectKanbanBoardProps {
  status: Status;
}

// ── Status dot config ───────────────────────────────────────
const STATUS_STYLES: Record<Status, string> = {
  open:        "w-2 h-2 rounded-full bg-outline",
  "in progress": "w-2 h-2 rounded-full bg-primary animate-pulse",
  completed:   "w-2 h-2 rounded-full bg-secondary",
};

// ── Component ───────────────────────────────────────────────
const ProjectKanbanBoard = ({ status }: ProjectKanbanBoardProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/projects?status=${status}`);
        setProjects(response.data.data.projects);
        setTotal(response.data.data.total);
      } catch (err) {
        setError("Failed to load projects.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status]);

  return (
    <div className="flex-1 flex flex-col gap-md kanban-col bg-surface-container-low/50 rounded-xl p-md border border-outline-variant/20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-sm">
        <h3 className="text-label-md font-label-md text-on-surface uppercase tracking-wider flex items-center gap-sm">
          <span className={STATUS_STYLES[status]} />
          {status}
        </h3>
        <span className="bg-surface border border-outline-variant/50 text-on-surface-variant text-label-sm px-2 py-1 rounded-full">
          {total}  {/* ✅ from API, not hardcoded */}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex flex-col gap-md overflow-y-auto pr-1 pb-4">

        {/* Loading */}
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-surface-container animate-pulse" />
        ))}

        {/* Error */}
        {!loading && error && (
          <p className="text-error text-body-sm text-center py-4">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <p className="text-on-surface-variant text-body-sm text-center py-4">
            No {status} projects.
          </p>
        )}

        {/* Cards — key directly on ProjectCard, no wrapper div */}
        {!loading && !error && projects.map((project) => (
          <ProjectCard
            key={project.id}  
            title={project.title}
            client={project.client}
            deadline={project.deadline}
            budget={project.budget}
            status={project.status}
          />
        ))}

      </div>
    </div>
  );
};

export default ProjectKanbanBoard;
