import React from "react";

/**
 * Base pulsing block. Every skeleton below is built from this —
 * change the color or animation once here and it updates everywhere.
 */
function Bone({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-container ${className}`}
      style={style}
    />
  );
}

/* ---------------------------------------------------------------------- */
/* Stat card — Total revenue / Outstanding / Active projects / Total clients */
/* ---------------------------------------------------------------------- */
export function StatCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Bone className="w-5 h-5 rounded-full" />
        <Bone className="h-4 w-24" />
      </div>
      <Bone className="h-8 w-32 mb-3" />
      <Bone className="h-3.5 w-20" />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Revenue Past 12 Months chart                                            */
/* ---------------------------------------------------------------------- */
// Fixed heights, not Math.random(). This page mounts client-side after an
// initial server render — random values here would differ between the two
// passes and throw a hydration mismatch. Deterministic beats "realistic".
const BAR_HEIGHTS = [55, 70, 40, 85, 60, 75, 50, 90, 65, 45, 80, 60];

export function RevenueChartSkeleton() {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Bone className="h-5 w-56" />
        <Bone className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex-1 min-h-50 flex flex-col justify-end mt-4">
        <div className="flex items-end justify-between gap-2 md:gap-4 h-48 border-b border-outline-variant pb-2">
          {BAR_HEIGHTS.map((h, i) => (
            <Bone
              key={i}
              className="w-full rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 px-2">
          {BAR_HEIGHTS.map((_, i) => (
            <Bone key={i} className="h-3 w-6" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Recent activity feed                                                    */
/* ---------------------------------------------------------------------- */
export function RecentActivitySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest max-h-85 border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Bone className="h-5 w-32" />
        <Bone className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex flex-col gap-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Bone className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1">
              <Bone className="h-3.5 w-full max-w-52 mb-2" />
              <Bone className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Project list — shared by "Active projects" and "Project due this month" */
/* Both panels render identical row markup in the page today; one row      */
/* skeleton covers both instead of forking it a third time.                */
/* ---------------------------------------------------------------------- */
function ProjectRowSkeleton() {
  return (
    <div className="flex gap-2 items-center w-full mb-2">
      <Bone className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1">
        <Bone className="h-4 w-32 mb-1.5" />
        <Bone className="h-3 w-20 mb-2" />
        <Bone className="h-3 w-28 mb-2" />
        <Bone className="h-1 w-50 rounded-full" />
      </div>
    </div>
  );
}

export function ProjectListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest border max-h-90 border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Bone className="h-5 w-40" />
        <Bone className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex flex-col gap-md">
        {Array.from({ length: rows }).map((_, i) => (
          <ProjectRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Invoice list — shared by "Invoices due this week" and "Recent invoices" */
/* ---------------------------------------------------------------------- */
function InvoiceRowSkeleton() {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <Bone className="w-10 h-10 rounded-full shrink-0" />
        <div>
          <Bone className="h-4 w-24 mb-1.5" />
          <Bone className="h-3 w-32" />
        </div>
      </div>
      <Bone className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function InvoiceListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Bone className="h-5 w-40" />
        <Bone className="h-3.5 w-14" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <InvoiceRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}