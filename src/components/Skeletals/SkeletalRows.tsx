import React from "react";
import { Bone } from "@/components/Skeletals/Bone";

export type ColConfig = {
  width: string;
  align?: "left" | "center" | "right";
  /** Second, smaller bone stacked beneath the first — e.g. name + description. */
  secondaryWidth?: string;
  /** Square icon-shaped bones instead of a text bone — e.g. an actions column. */
  iconCount?: number;
  /** Circular bone rendered before the text bone — e.g. an avatar + name cell. */
  withAvatar?: boolean;
  cellClassName?: string;
};

/**
 * Renders `rows` <tr> skeletons matching `columns`. Deliberately has no
 * <table>/<thead> of its own — drop it straight into an existing <tbody>
 * so it always inherits the real header/column count instead of risking
 * drift between the two (see the invoices page: the old skeleton had 5
 * columns against 6 real ones).
 *
 * Suggested path: components/Skeleton/SkeletonRows.tsx
 */
export const SkeletonRows = ({
  columns,
  rows,
}: {
  columns: ColConfig[];
  rows: number;
}) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-b border-outline-variant/30 last:border-0">
        {columns.map((col, j) => {
          const alignClass =
            col.align === "right"
              ? "text-right"
              : col.align === "center"
                ? "text-center"
                : "";
          return (
            <td key={j} className={`py-4 px-6 ${alignClass} ${col.cellClassName ?? ""}`}>
              {col.iconCount ? (
                <div className={`flex gap-3 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : ""}`}>
                  {Array.from({ length: col.iconCount }).map((_, k) => (
                    <Bone key={k} className="h-5 w-5 rounded" />
                  ))}
                </div>
              ) : col.withAvatar ? (
                <div className="flex items-center gap-2">
                  <Bone className="w-8 h-8 rounded-full shrink-0" />
                  <Bone className={`h-4 ${col.width}`} />
                </div>
              ) : (
                <>
                  <Bone
                    className={`h-4 ${col.width} ${
                      col.align === "right" ? "ml-auto" : col.align === "center" ? "mx-auto" : ""
                    }`}
                  />
                  {col.secondaryWidth && <Bone className={`h-3 ${col.secondaryWidth} mt-2`} />}
                </>
              )}
            </td>
          );
        })}
      </tr>
    ))}
  </>
);