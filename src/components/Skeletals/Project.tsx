import React from "react";
import { Bone } from "./Bone";

/**
 * Skeletons for app/projects/[id]/page.tsx, one component per visual
 * section, mirroring real classes/widths so there's no layout shift.
 *
 * NOTE: `TasksTableSkeleton` and `TimeLogTableSkeleton` are generic
 * placeholders — TasksTable and TimeLogTable weren't in the file I was
 * given, so I can't mirror their real DOM. Share those two component
 * files if you want pixel-matched versions instead of the approximation
 * below.
 */

/** Back button + Edit Project / Mark as Done actions. */
export const ProjectActionsSkeleton = () => (
  <div className="flex justify-between items-center mb-xl">
    <div className="flex items-center gap-2">
      <Bone className="h-5 w-5 rounded-full" />
      <Bone className="h-4 w-28" />
    </div>
    <div className="flex gap-md">
      <Bone className="h-9 w-32 rounded-lg" />
      <Bone className="h-9 w-36 rounded-lg" />
    </div>
  </div>
);

/** Bento header: status, title, client/company, budget, start/deadline/elapsed row. */
export const ProjectHeaderCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-lg overflow-hidden relative">
    <div className="flex justify-between items-start relative z-9">
      <div>
        <Bone className="h-6 w-24 rounded-lg mb-2" />
        <Bone className="h-7 w-56 mb-sm" />
        <div className="flex items-center gap-md mt-sm">
          <div className="flex items-center gap-2">
            <Bone className="h-5 w-5 rounded-full" />
            <Bone className="h-4 w-24" />
          </div>
          <div className="w-1 h-1 bg-outline-variant rounded-full" />
          <div className="flex items-center gap-2">
            <Bone className="h-5 w-5 rounded-full" />
            <Bone className="h-4 w-28" />
          </div>
        </div>
      </div>
      <div className="text-right">
        <Bone className="h-3 w-24 mb-2 ml-auto" />
        <Bone className="h-7 w-28 ml-auto" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-lg border-t border-outline-variant/30 pt-lg relative z-9">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start flex-col gap-2">
          <Bone className="h-3 w-20" />
          <Bone className="h-4 w-28" />
        </div>
      ))}
    </div>
  </div>
);

/** Project description block. */
export const ProjectDescriptionCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-lg">
    <div>
      <Bone className="h-4 w-40 mb-md" />
      <div className="flex flex-col gap-2">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

/** Approximate placeholder — see NOTE above. */
export const TasksTableSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
    <Bone className="h-4 w-24 mb-md" />
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Bone key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

/** Client avatar/name/company + mail/phone rows. */
export const ClientContactCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
    <Bone className="h-3 w-28 mb-md" />
    <div className="flex items-center gap-md mb-lg">
      <Bone className="h-11 w-11 rounded-full shrink-0" />
      <div>
        <Bone className="h-4 w-28 mb-1.5" />
        <Bone className="h-3.5 w-20" />
      </div>
    </div>
    <div className="space-y-sm">
      <div className="w-full flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
        <Bone className="h-5 w-5 rounded-full" />
        <Bone className="h-3.5 w-36" />
      </div>
      <div className="w-full flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
        <Bone className="h-5 w-5 rounded-full" />
        <Bone className="h-3.5 w-32" />
      </div>
    </div>
  </div>
);

/**
 * Invoices summary card: header + `rows` table rows + footer link.
 * `rows` defaults to 4 to match the page's own `invoicesLimit` default.
 */
export const InvoicesSummaryCardSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden card-shadow">
    <div className="p-md flex justify-between items-center border-b border-outline-variant/30">
      <Bone className="h-4 w-32" />
      <Bone className="h-7 w-28 rounded-lg" />
    </div>
    <table className="w-full text-left border-collapse">
      <thead className="bg-surface-container-low border-b border-outline-variant/30">
        <tr>
          <th className="p-3">
            <Bone className="h-3 w-14" />
          </th>
          <th className="p-3">
            <Bone className="h-3 w-12" />
          </th>
          <th className="p-3">
            <Bone className="h-3 w-16" />
          </th>
          <th className="p-3 text-right">
            <Bone className="h-3 w-14 ml-auto" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="border-b border-outline-variant/10">
            <td className="p-3">
              <Bone className="h-3.5 w-16" />
            </td>
            <td className="p-3">
              <Bone className="h-3.5 w-20" />
            </td>
            <td className="p-3">
              <Bone className="h-5 w-16 rounded-lg" />
            </td>
            <td className="p-3 text-right">
              <Bone className="h-3.5 w-16 ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="p-md flex justify-center">
      <Bone className="h-3.5 w-28" />
    </div>
  </div>
);

/** Approximate placeholder — see NOTE above. */
export const TimeLogTableSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
    <Bone className="h-4 w-24 mb-md" />
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Bone key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

/** Full-page composition — drop this in while project/invoices are loading. */
export const ProjectDetailSkeleton = () => (
  <div className="flex-1 flex flex-col min-w-0 relative">
    <div className="flex-1 overflow-y-auto p-10 md:px-gutter max-w-container-max mx-auto w-full">
      <ProjectActionsSkeleton />
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-8 space-y-gutter">
          <ProjectHeaderCardSkeleton />
          <ProjectDescriptionCardSkeleton />
          <TasksTableSkeleton />
        </div>
        <div className="col-span-4 space-y-gutter">
          <ClientContactCardSkeleton />
          <InvoicesSummaryCardSkeleton />
          <TimeLogTableSkeleton />
        </div>
      </div>
    </div>
  </div>
);

export default ProjectDetailSkeleton;