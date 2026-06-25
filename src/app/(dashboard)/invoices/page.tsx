"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

const page = () => {
  const session = useSession();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceOffset, setInvoiceOffset] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const limit = 9;
  useEffect(() => {
    const fetchInvoices = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get(
            `/api/Invoices?offset=${invoiceOffset}&limit=${limit}`
          );
          const fetchedInvoices = Array.isArray(response.data.data.invoices)
            ? response.data.data.invoices
            : Array.isArray(response.data.data.invoices)
              ? response.data.data.invoices
              : [];
          console.log("Fetched invoices:", fetchedInvoices);
          setInvoices(fetchedInvoices);
          setTotalInvoices(response.data.data.total);
        } catch (error) {
          console.error("Error fetching invoices:", error);
          toast.error("Error fetching invoices");
        }
      }
    };

    fetchInvoices();
  }, [invoiceOffset, limit, session?.data?.user?._id]);
  return (
    <main className="flex-1  min-h-screen bg-background">
      <div className="max-w-container-max mx-auto p-lg md:p-xl space-y-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Invoices
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Manage your billing and track payments.
            </p>
          </div>
          <button className="flex items-center justify-center gap-sm bg-primary text-on-primary font-label-md text-label-md py-sm px-lg rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="glass-card rounded-xl p-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Outstanding
              </span>
              <span className="material-symbols-outlined text-outline">
                pending_actions
              </span>
            </div>
            <div>
              <span className="font-display text-display text-on-surface">
                $12,450
              </span>
              <div className="flex items-center gap-xs mt-xs text-secondary">
                <span className="material-symbols-outlined text-[16px]">
                  trending_up
                </span>
                <span className="font-label-sm text-label-sm">
                  +4.2% from last month
                </span>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Paid this month
              </span>
              <span className="material-symbols-outlined text-secondary">
                check_circle
              </span>
            </div>
            <div>
              <span className="font-display text-display text-on-surface">
                $8,200
              </span>
              <div className="w-full bg-surface-variant h-unit rounded-full mt-sm overflow-hidden">
                <div className="bg-secondary h-full w-[65%] rounded-full"></div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                65% of monthly target
              </p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-lg flex flex-col justify-between !border-l-4 !border-0 !border-accent">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Overdue
              </span>
              <span className="material-symbols-outlined text-accent text-error">
                warning
              </span>
            </div>
            <div>
              <span className="font-display text-accent text-display text-error">
                $1,850
              </span>
              <p className="font-label-sm text-label-sm text-accent mt-xs">
                2 invoices need attention
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-md items-center justify-between glass-card rounded-lg p-sm">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full pl-xl pr-sm py-sm rounded-md bg-surface-container-lowest border border-outline-variant text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Search invoices by client or ID..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
            <div className="flex bg-surface-container-low rounded-md p-1">
              <button className="px-sm py-xs rounded text-label-sm font-label-sm bg-surface-container-lowest shadow-sm text-on-surface">
                All
              </button>
              <button className="px-sm py-xs rounded text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                Paid
              </button>
              <button className="px-sm py-xs rounded text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                Pending
              </button>
              <button className="px-sm py-xs rounded text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                Overdue
              </button>
            </div>
            <button className="flex items-center gap-xs px-sm py-sm border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>
              Last 30 Days
              <span className="material-symbols-outlined text-[18px]">
                arrow_drop_down
              </span>
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50">
                  <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Invoice ID
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Client
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Issue Date
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-semibold text-right">
                    Amount
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-semibold text-center">
                    Status
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice?._id}
                    className="border-b border-outline-variant/30 hover:bg-surface-container-lowest/50 transition-colors group"
                  >
                    <td className="py-sm px-lg font-medium text-on-surface">
                      {invoice?.invoiceNumber}
                    </td>
                    <td className="py-sm px-lg">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden">
                          {invoice?.client.charAt(0).toUpperCase() +
                            invoice?.client.split(" ").slice(-1)[0].charAt(0).toUpperCase()}
                        </div>
                        <span className="text-on-surface">
                          {invoice?.client}
                        </span>
                      </div>
                    </td>
                    <td className="py-sm px-lg text-on-surface-variant">
                      {invoice?.invoiceDate}
                    </td>
                    <td className="py-sm px-lg text-right font-medium text-on-surface">
                      {invoice?.totalAmount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: session?.data?.user?.currency || "USD",
                      })}
                    </td>
                    <td className="py-sm px-lg text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
                        Pending
                      </span>
                    </td>
                    <td className="py-sm px-lg text-right">
                      <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">
                            send
                          </span>
                        </button>
                        <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">
                            picture_as_pdf
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-sm flex items-center justify-between border-t border-outline-variant/30 text-label-sm text-on-surface-variant bg-surface-container-lowest/50">
            <span>Showing 1 to 3 of 24 entries</span>
            <div className="flex gap-1">
              <button
                className="px-2 py-1 rounded hover:bg-surface-variant disabled:opacity-50"
                disabled={true}
              >
                &lt;
              </button>
              <button className="px-2 py-1 rounded bg-primary text-on-primary">
                1
              </button>
              <button className="px-2 py-1 rounded hover:bg-surface-variant">
                2
              </button>
              <button className="px-2 py-1 rounded hover:bg-surface-variant">
                3
              </button>
              <button className="px-2 py-1 rounded hover:bg-surface-variant">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
