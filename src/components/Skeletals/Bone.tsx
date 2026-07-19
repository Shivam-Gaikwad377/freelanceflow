import React from "react";
 
/**
 * Base skeleton primitive. Single source of truth for the pulse/fill styling —
 * every skeleton component in the app composes from this instead of repeating
 * `animate-pulse bg-surface-container-high` inline.
 *
 * Suggested path: components/Skeleton/Bone.tsx
 */
export const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-surface-container-high ${className}`} />
);
 