import React from "react";
import { Bone } from "@/components/Skeletals/Bone";
import { SkeletonRows, ColConfig } from "@/components/Skeletals/SkeletalRows";

/* ---------------------------------------------------------------------- */
/* Client detail page — recent invoices table. Gate on `invoiceLoading`.   */
/* Full table incl. its own header, since this section renders nothing    */
/* else while loading.                                                    */
/* ---------------------------------------------------------------------- */

const DETAIL_INVOICE_HEADERS = ["Invoice #", "Due Date", "Status", "Amount", ""];

const DETAIL_INVOICE_COLUMNS: ColConfig[] = [
  { width: "w-24" },
  { width: "w-20" },
  { width: "w-16" },
  { width: "w-20", align: "right" },
  { width: "w-10", align: "right", iconCount: 2 }, // download + delete icons
];

export const InvoiceTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            {DETAIL_INVOICE_HEADERS.map((label, i) => (
              <th
                key={label || i}
                className={`py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold ${
                  DETAIL_INVOICE_COLUMNS[i]?.align === "right" ? "text-right" : ""
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <SkeletonRows columns={DETAIL_INVOICE_COLUMNS} rows={rows} />
        </tbody>
      </table>
    </div>
  </div>
);

/* ---------------------------------------------------------------------- */
/* Invoices list page — stats row. Gate on `statsLoading`.                 */
/* Currently these cards render "$0.00" while loading, which reads as      */
/* real data rather than a loading state — this replaces that.            */
/* ---------------------------------------------------------------------- */

const StatCardSkeleton = () => (
  <div className="glass-card rounded-xl p-lg flex flex-col justify-between">
    <div className="flex items-center justify-between mb-sm">
      <Bone className="h-4 w-24" />
      <Bone className="h-5 w-5 rounded" />
    </div>
    <Bone className="h-8 w-32" />
  </div>
);

export const InvoiceStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
    <StatCardSkeleton />
    <StatCardSkeleton />
    <StatCardSkeleton />
  </div>
);

/* ---------------------------------------------------------------------- */
/* Invoices list page — table rows. Gate on `invoiceLoading`, NOT          */
/* `isSearching` (that flag is never set to true anywhere in the page, so  */
/* the existing skeleton branch is dead code — and it only has 5 <td>s     */
/* where real rows have 6, so it'd misalign even if it fired).            */
/* The page's <thead> is static and unconditional, so this is rows-only.  */
/* ---------------------------------------------------------------------- */

const LIST_INVOICE_COLUMNS: ColConfig[] = [
  { width: "w-24" }, // invoice number
  { width: "w-32", withAvatar: true }, // client avatar + name
  { width: "w-20" }, // issue date
  { width: "w-16", align: "right" }, // amount
  { width: "w-14", align: "center" }, // status badge
  { width: "w-5", align: "right" }, // action column — icon only shows on row hover, so leave blank
];

export const InvoiceRowsSkeleton = ({ rows = 9 }: { rows?: number }) => (
  <SkeletonRows columns={LIST_INVOICE_COLUMNS} rows={rows} />
);