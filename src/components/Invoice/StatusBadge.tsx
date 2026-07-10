import React from "react";

type StatusBadgeProps = {
  color: "success" | "normal" | "error";
  label: string | undefined;
  fontSize?: "small" | "medium" | "large";
};
const StatusBadge = ({ color, label, fontSize }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center  w-auto h-auto rounded-full ${fontSize === "small" ? "text-label-sm  px-2" : fontSize === "medium" ? "text-label-md px-3 py-1" : "text-label-lg px-3 py-1"} uppercase tracking-wide ${color === "success" ? "bg-secondary-container/50 text-on-secondary-container border-secondary/20" : color === "error" ? "bg-accent/50 text-on-accent-container" : color=== "normal" ? "bg-surface-variant text-on-surface-variant" : ""}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
