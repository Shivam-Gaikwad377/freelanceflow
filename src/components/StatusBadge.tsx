import React from "react";

type StatusBadgeProps = {
  color: "success" | "normal" | "error";
  label: string;
  fontSize?: "small" | "medium" | "large";
};
const StatusBadge = ({ color, label, fontSize }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${fontSize === "small" ? "text-label-sm" : fontSize === "medium" ? "text-label-md" : "text-label-lg"} uppercase tracking-wide ${color === "success" ? "bg-secondary-container/50 text-on-secondary-container border-secondary/20" : color === "error" ? "bg-accent/50 text-on-accent-container" : color=== "normal" ? "bg-surface-variant text-on-surface-variant" : ""}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
