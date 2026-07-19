import { Bone } from "@/components/Skeletals/Bone";
import React from "react";

/**
 * Base skeleton primitive. Single source of truth for the pulse/fill styling —
 * every skeleton in this file composes from this instead of repeating
 * `animate-pulse bg-surface-container-high` inline.
 */

/* ---------------------------------------------------------------------- */
/* 1. Client header skeleton — gate this on `clientLoading`                */
/* ---------------------------------------------------------------------- */

export const ClientHeaderSkeleton = () => (
  <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg md:p-xl mb-xl shadow-sm">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="flex items-start gap-6 w-full">
        <Bone className="w-16 h-16 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Bone className="h-7 w-48" />
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          <Bone className="h-4 w-full max-w-md mb-1.5" />
          <Bone className="h-4 w-2/3 max-w-sm mb-4" />
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Bone className="h-4 w-40" />
            <Bone className="h-4 w-32" />
            <Bone className="h-4 w-36" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
        <div className="flex gap-3 w-full md:w-auto">
          <Bone className="h-10 w-32 rounded-lg" />
          <Bone className="h-10 w-36 rounded-lg" />
        </div>
        <div>
          <Bone className="h-3 w-24 mb-2" />
          <Bone className="h-7 w-28" />
        </div>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* 2. Generic table skeleton — shared by Projects and Invoices             */
/* ---------------------------------------------------------------------- */

type ColConfig = {
  width: string;
  align?: "left" | "right";
  /** Renders a second, smaller bone beneath the first — e.g. name + description. */
  secondaryWidth?: string;
  /** Renders N square icon bones instead of a text bone — e.g. the actions column. */
  iconCount?: number;
};

const SkeletonTable = ({
  headers,
  columns,
  rows = 5, // matches `limit = 5` in the page
}: {
  headers: string[];
  columns: ColConfig[];
  rows?: number;
}) => (
  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            {headers.map((label, i) => (
              <th
                key={label}
                className={`py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold ${
                  columns[i]?.align === "right" ? "text-right" : ""
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-outline-variant/30 last:border-0">
              {columns.map((col, j) => (
                <td
                  key={j}
                  className={`py-4 px-6 ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.iconCount ? (
                    <div className={`flex gap-3 ${col.align === "right" ? "justify-end" : ""}`}>
                      {Array.from({ length: col.iconCount }).map((_, k) => (
                        <Bone key={k} className="h-5 w-5 rounded" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <Bone
                        className={`h-4 ${col.width} ${col.align === "right" ? "ml-auto" : ""}`}
                      />
                      {col.secondaryWidth && (
                        <Bone className={`h-3 ${col.secondaryWidth} mt-2`} />
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ---------------------------------------------------------------------- */
/* 3. Concrete instances — gate on `projectLoading` / `invoiceLoading`     */
/* ---------------------------------------------------------------------- */

export const ProjectTableSkeleton = () => (
  <SkeletonTable
    headers={["Project Name", "Status", "Start Date", "Value", ""]}
    columns={[
      { width: "w-40", secondaryWidth: "w-56" }, // title + description
      { width: "w-16" },
      { width: "w-20" },
      { width: "w-20" },
      { width: "w-5", iconCount: 1 }, // delete icon
    ]}
  />
);

export const InvoiceTableSkeleton = () => (
  <SkeletonTable
    headers={["Invoice #", "Due Date", "Status", "Amount", ""]}
    columns={[
      { width: "w-24" },
      { width: "w-20" },
      { width: "w-16" },
      { width: "w-20", align: "right" },
      { width: "w-10", align: "right", iconCount: 2 }, // download + delete icons
    ]}
  />
);


 
/**
 * I don't have ClientCard.tsx's actual markup — this is inferred from the
 * props it's given (name, status, phone, email, totalBilled) plus the
 * avatar/contact-row pattern already established in ClientHeaderSkeleton.
 * If ClientCard's real layout differs (e.g. no avatar, different field
 * order), share that file and I'll match it exactly instead of guessing.
 */
const ClientCardSkeleton = () => (
  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-lg flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Bone className="w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Bone className="h-5 w-32 mb-2" />
        <Bone className="h-4 w-16 rounded-full" />
      </div>
    </div>
 
    <div className="flex flex-col gap-2">
      <Bone className="h-4 w-40" />
      <Bone className="h-4 w-44" />
    </div>
 
    <div className="pt-2 border-t border-outline-variant/50">
      <Bone className="h-3 w-20 mb-2" />
      <Bone className="h-6 w-28" />
    </div>
  </div>
);
 
/**
 * Drop-in replacement for the `clients.map(...)` grid. Renders `count`
 * cards inside the exact same grid classes as the real grid so nothing
 * shifts when data arrives.
 */
export const ClientsGridSkeleton = ({ count = 9 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
    {Array.from({ length: count }).map((_, i) => (
      <ClientCardSkeleton key={i} />
    ))}
  </div>
);