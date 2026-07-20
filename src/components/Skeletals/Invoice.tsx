import React from "react";
import { Bone } from "@/components/Skeletals/Bone";
import { SkeletonRows, ColConfig } from "@/components/Skeletals/SkeletalRows";

/* ---------------------------------------------------------------------- */
/* Client detail page — recent invoices table. Gate on `invoiceLoading`.   */
/* Full table incl. its own header, since this section renders nothing    */
/* else while loading.                                                    */
/* ---------------------------------------------------------------------- */

const DETAIL_INVOICE_HEADERS = [
  "Invoice #",
  "Due Date",
  "Status",
  "Amount",
  "",
];

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
                  DETAIL_INVOICE_COLUMNS[i]?.align === "right"
                    ? "text-right"
                    : ""
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

export const InvoiceActionsSkeleton = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Bone className="h-5 w-5 rounded-full" />
      <Bone className="h-4 w-28" />
    </div>
    <div className="flex items-center justify-center gap-sm mb-lg">
      <Bone className="h-9 w-28 rounded-lg" />
      <Bone className="h-9 w-32 rounded-lg" />
    </div>
  </div>
);

/** Invoice number, status badge, issue/due date, total amount. */
export const InvoiceSummaryCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg mb-md">
    <div className="flex items-start justify-between">
      <div>
        <Bone className="h-3 w-16 mb-1.25" />
        <Bone className="h-6 w-36" />
      </div>
      <Bone className="h-7 w-20 rounded-lg" />
    </div>
    <div className="border-t border-outline-variant/30 mt-md pt-md grid grid-cols-3 gap-md">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <Bone className="h-3 w-20 mb-[4px]" />
          <Bone className="h-4 w-28" />
        </div>
      ))}
    </div>
  </div>
);

/** Client identity + contact info. */
export const BillToCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
    <Bone className="h-3 w-16 mb-sm" />
    <div className="flex items-center gap-3 mb-sm">
      <Bone className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex gap-2">
        <Bone className="h-4 w-24" />
        <Bone className="h-4 w-14 rounded-lg" />
      </div>
    </div>
    <div className="border-t border-outline-variant/30 pt-2.5 flex flex-col gap-1.75">
      <Bone className="h-3.5 w-40" />
      <Bone className="h-3.5 w-32" />
    </div>
  </div>
);

/** Linked project title + status/deadline. */
export const ProjectCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
    <Bone className="h-3 w-16 mb-sm" />
    <div className="flex items-center gap-2.5 mb-sm">
      <Bone className="h-9 w-9 rounded-lg shrink-0" />
      <Bone className="h-4 w-32" />
    </div>
    <div className="border-t border-outline-variant/30 pt-2.5 flex flex-col gap-1.75">
      <Bone className="h-3.5 w-24" />
      <Bone className="h-3.5 w-44" />
    </div>
  </div>
);

/**
 * Line-items table: header row + `rows` body rows + subtotal/total footer.
 * `rows` defaults to 3 rather than being hardcoded, since the real row
 * count is exactly the thing we don't know yet during loading.
 */
export const LineItemsTableSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
    <div className="flex justify-between px-1 mb-sm">
      <Bone className="h-3 w-20" />
      <Bone className="h-7 w-24 rounded-lg" />
    </div>

    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr className="border-b border-outline-variant/30">
          <th className="text-left py-sm w-[40%]">
            <Bone className="h-3 w-20" />
          </th>
          <th className="text-left py-sm w-[10%]">
            <Bone className="h-3 w-8" />
          </th>
          <th className="text-left py-sm w-[15%]">
            <Bone className="h-3 w-10" />
          </th>
          <th className="text-left py-sm w-[15%]">
            <Bone className="h-3 w-10" />
          </th>
          <th className="text-left py-sm w-[10%]">
            <Bone className="h-3 w-10" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td className="py-2.75 w-[40%]">
              <Bone className="h-4 w-3/4" />
            </td>
            <td className="py-2.75 w-[10%]">
              <Bone className="h-4 w-8" />
            </td>
            <td className="py-2.75 w-[15%]">
              <Bone className="h-4 w-12" />
            </td>
            <td className="py-2.75 w-[15%]">
              <Bone className="h-4 w-14" />
            </td>
            <td className="py-2.75 w-[10%]">
              <Bone className="h-7 w-14 rounded-lg" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="border-t border-outline-variant/30 mt-sm pt-3.5 flex justify-end">
      <div className="min-w-52.5 flex flex-col gap-2.5">
        <div className="flex justify-between">
          <Bone className="h-3.5 w-16" />
          <Bone className="h-3.5 w-16" />
        </div>
        <div className="border-t border-outline-variant/30 pt-2.5 flex justify-between">
          <Bone className="h-4 w-12" />
          <Bone className="h-4 w-16" />
        </div>
      </div>
    </div>
  </div>
);

/** Full-page composition — drop this in place of <Page /> while loadingInvoice is true. */
export const InvoiceDetailSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="flex-1 px-xl mx-auto w-full">
    <div className="py-md">
      <InvoiceActionsSkeleton />
      <InvoiceSummaryCardSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mb-md">
        <BillToCardSkeleton />
        <ProjectCardSkeleton />
      </div>
      <LineItemsTableSkeleton rows={rows} />
    </div>
  </div>
);
