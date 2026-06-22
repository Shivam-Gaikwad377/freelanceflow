
import React from "react";
interface ProjectPageProps {
  // Define any props you want to pass to the component here
    title: string; // Project title
    client: string; // Client name
    deadline: string; // Deadline date
    budget: number; // Project budget
     // Optional click handler
    status: "open" | "in progress" | "completed"; // Project status
     // Optional click handler
}
type style = {
  [key: string]: string;
};
const ProjectCard = ({ title, client, deadline,budget,status  }: ProjectPageProps) => {
 
    const clientInitialsColor: style = {
    A: "bg-amber-200", // Amber
    B: "bg-blue-200", // Blue
    C: "bg-cyan-200", // Cyan
    D: "bg-slate-200", // Denim / Dark Slate
    E: "bg-emerald-200", // Emerald
    F: "bg-fuchsia-200", // Fuchsia
    G: "bg-green-200", // Green
    H: "bg-yellow-200", // Honey
    I: "bg-indigo-200", // Indigo
    J: "bg-teal-200", // Jade
    K: "bg-stone-200", // Khaki
    L: "bg-lime-200", // Lime
    M: "bg-rose-200", // Magenta / Maroon
    N: "bg-blue-100", // Navy (Soft tint)
    O: "bg-orange-200", // Orange
    P: "bg-purple-200", // Purple
    Q: "bg-zinc-200", // Quartz
    R: "bg-red-200", // Red
    S: "bg-sky-200", // Sky
    T: "bg-teal-100", // Teal
    U: "bg-indigo-100", // Ultramarine (Soft tint)
    V: "bg-violet-200", // Violet
    W: "bg-rose-100", // Wine (Soft tint)
    X: "bg-lime-100", // Xanthic
    Y: "bg-yellow-100", // Yellow
    Z: "bg-zinc-100",
  };
  return (
    <div className="bg-surface rounded-lg p-lg border border-outline-variant/40 shadow-sm hover:shadow-[0_8px_24px_rgba(96,99,238,0.04)] hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group">
      <h4 className="text-body-md font-body-md font-semibold text-on-surface mb-1">
        {title}
      </h4>
      <p className="text-body-sm font-body-sm text-on-surface-variant mb-md flex items-center gap-xs">
        <span className="material-symbols-outlined text-[16px]">domain</span>{" "}
        {client}
      </p>
      <div className="flex justify-between items-center border-t border-outline-variant/20 pt-md mt-sm">
        <div className="flex items-center gap-xs text-on-surface-variant text-label-sm font-label-sm">
          <span className="material-symbols-outlined text-[14px]">
            calendar_today
          </span>
          {new Date(deadline).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        {/* <div className={`${clientInitialsColor[client.charAt(0).toUpperCase()]} w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-primary`}>
        
        </div> */}
      </div>
    </div>
  );
};

export default ProjectCard;
