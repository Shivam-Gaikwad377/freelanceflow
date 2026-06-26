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
  const router = useRouter();
  const [stats, setStats] = useState({
    outstanding: {
      total: 0,
      count: 0,
    },
    paidThisMonth: {
      total: 0,
      count: 0,
    },
    overdue: {
      total: 0,
      count: 0,
    },
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get(
            `/api/Invoices?offset=${invoiceOffset}&limit=${limit}&sort=asc`
          );
          const fetchedInvoices = Array.isArray(response.data.data.invoices)
            ? response.data.data.invoices
            : Array.isArray(response.data.data.invoices)
              ? response.data.data.invoices
              : [];
          console.log("Fetched invoices:", session);
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
  useEffect(() => {
    const fetchStats = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get(`/api/Invoices/stats`);
          setStats(response.data.data);
        } catch (error) {
          console.error("Error fetching invoice stats:", error);
          toast.error("Error fetching invoice stats");
        }
      }
    };

    fetchStats();
  }, [session?.data?.user?._id]);

  const currencys = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "JPY", symbol: "¥" },
    { code: "CAD", symbol: "C$" },
    { code: "INR", symbol: "₹" },
    { code: "AUD", symbol: "A$" },
    { code: "CHF", symbol: "CHF" },
  ];
  return (
    <div className="flex-1  min-h-screen bg-background">
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
                {stats?.outstanding?.total?.toLocaleString("en-US", {
                        style: "currency",
                        currency: session?.data?.user?.currency || "USD",
                      })}
              </span>
              
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
                {stats?.paidThisMonth?.total?.toLocaleString("en-US", {
                  style: "currency",
                  currency: session?.data?.user?.currency || "USD",
                })}
              </span>
              <div className="w-full bg-surface-variant h-unit rounded-full mt-sm overflow-hidden">
                <div className="bg-secondary h-full w-[65%] rounded-full"></div>
              </div>
             
            </div>
          </div>
          <div className="glass-card rounded-xl p-lg flex flex-col justify-between border-l-4! border-0! border-accent!">
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
                {stats?.overdue?.total?.toLocaleString("en-US", {
                  style: "currency",
                  currency: session?.data?.user?.currency || "USD",
                })}
              </span>
              <p className="font-label-sm text-label-sm text-accent mt-xs">
                {stats?.overdue?.count} invoices need attention
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
                  <th className="py-md px-lg font-label-sm text-label-lg text-on-surface-variant font-semibold">
                    Invoice Number
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-lg text-on-surface-variant font-semibold">
                    Client
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-lg text-on-surface-variant font-semibold">
                    Issue Date
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-lg text-on-surface-variant font-semibold text-right">
                    Amount
                  </th>
                  <th className="py-md px-lg font-label-sm text-label-lg text-on-surface-variant font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {invoices.map((invoice) => (
                  <tr
                    onClick={()=> router.push(`/invoices/${invoice._id}`)}
                    key={invoice?._id}
                    className="border-b cursor-pointer border-outline-variant/30 hover:bg-surface-container-lowest/50 transition-colors group"
                  >
                    <td className="py-sm px-lg font-medium text-on-surface">
                      {invoice?.invoiceNumber}
                    </td>
                    <td className="py-sm px-lg">
                      <div className="flex items-center gap-sm">
                        <div className="p-2 aspect-square rounded-full flex text-label-md items-center justify-center bg-surface-variant overflow-hidden">
                          {invoice?.client.charAt(0).toUpperCase() +
                            invoice?.client
                              .split(" ")
                              .slice(-1)[0]
                              .charAt(0)
                              .toUpperCase()}
                        </div>
                        <span className="text-on-surface">
                          {invoice?.client}
                        </span>
                      </div>
                    </td>
                    <td className="py-sm px-lg text-on-surface-variant">
                      {new Date(invoice?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="py-sm px-lg text-right font-medium text-on-surface">
                      {invoice?.amount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: session?.data?.user?.currency || "USD",
                      })}
                    </td>
                    <td className="py-sm px-lg text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-sm flex items-center justify-between border-t border-outline-variant/30 text-label-sm text-on-surface-variant bg-surface-container-lowest/50">
            <div className="flex gap-1">
              <Pagination
                total={totalInvoices}
                offset={invoiceOffset}
                limit={limit}
                onPageChange={(newOffset) => setInvoiceOffset(newOffset)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
