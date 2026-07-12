"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";
import { useUiStore } from "@/store/useUiStore";
import useDebounce from "@/app/hooks/useDebounce";
import useFetch from "@/app/hooks/useFetch";
import { IInvoice } from "@/schemas/createInvoice.schema";
import PrimaryButton from "@/components/PrimaryButton";
import StatusBadge from "@/components/Invoice/StatusBadge";
import ClientInitialBadge from "@/components/Client/ClientInitialBadge";
import ConfirmationBox from "@/components/confirmationBox";
import { set } from "mongoose";

const Page = () => {
  type InvoiceStatusFilter = "all" | "Paid" | "pending" | "overdue";

  const INVOICE_STATUS_FILTERS: {
    label: string;
    value: InvoiceStatusFilter;
  }[] = [
    { label: "All", value: "all" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "pending" },
    { label: "Overdue", value: "overdue" },
  ];
  const session = useSession();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [invoiceOffset, setInvoiceOffset] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const openModal = useUiStore((state) => state.openModal);
  const limit = 9;
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] =
    useState<InvoiceStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [monthRange, setMonthRange] = useState<string>("all");
  const isNumeric = (str: string) => /^\d+$/.test(str.trim());
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string >("");

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
  const {
    data: invoiceData,
    loading: invoiceLoading,
    error: invoiceError,
  } = useFetch(`/api/Invoices`, {
    offset: invoiceOffset,
    limit,
    sort: "asc",
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: debouncedSearchTerm || undefined,
    searchBy: isNumeric(debouncedSearchTerm) ? "invoiceNumber" : "clientName",
    monthRange: monthRange !== "all" ? monthRange : undefined,
  });
  useEffect(() => {
    if (invoiceData) {
      setInvoices(invoiceData?.invoices || []);
      setTotalInvoices(invoiceData?.total || 0);
    }
  }, [invoiceData, session?.data?.user?._id]);
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useFetch(`/api/Invoices/stats`);
  useEffect(() => {
    if (statsData) {
      setStats(statsData);
    }
  }, [statsData]);
  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const response = await axios.delete(`/api/Invoices/${invoiceId}`);
      if (response.data.success) {
        toast.success("Invoice deleted successfully");
        setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id.toString() !== invoiceId));
      }
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };


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
          <PrimaryButton
            label=" New Invoice"
            onClick={() => openModal("addInvoice")}
            icon="add"
          />
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
            <div className="flex bg-surface-container-low rounded-md p-1">
              {INVOICE_STATUS_FILTERS.map((filter) => (
                <label
                  key={filter.value}
                  className="px-sm py-xs rounded text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer has-checked:bg-surface-container-lowest has-checked:shadow-sm has-checked:text-on-surface"
                >
                  <input
                    type="radio"
                    name="invoice-status-filter"
                    value={filter.value}
                    checked={selectedStatus === filter.value}
                    onChange={() => {
                      setSelectedStatus(filter.value);
                      setInvoiceOffset(0);
                    }}
                    className="sr-only"
                  />
                  {filter.label}
                </label>
              ))}
            </div>
            <select
              className="flex items-center gap-xs px-sm py-sm border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors bg-surface-container-lowest"
              value={monthRange}
              onChange={(e) => setMonthRange(e.target.value)}
            >
              <option selected={monthRange === "all"} value="all">
                All Time
              </option>
              <option value="1">Last 1 Month</option>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
            </select>
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
                  <th className=" font-label-sm text-label-lg text-on-surface-variant font-semibold"></th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {isSearching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`skeleton-${i}`}
                      className="border-b border-outline-variant/30 animate-pulse"
                    >
                      <td className="py-sm px-lg">
                        <div className="h-4 w-24 bg-surface-variant rounded" />
                      </td>
                      <td className="py-sm px-lg">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded-full bg-surface-variant" />
                          <div className="h-4 w-32 bg-surface-variant rounded" />
                        </div>
                      </td>
                      <td className="py-sm px-lg">
                        <div className="h-4 w-20 bg-surface-variant rounded" />
                      </td>
                      <td className="py-sm px-lg text-right">
                        <div className="h-4 w-16 bg-surface-variant rounded ml-auto" />
                      </td>
                      <td className="py-sm px-lg text-center">
                        <div className="h-4 w-14 bg-surface-variant rounded mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : debouncedSearchTerm && invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-2xl px-lg text-center">
                      <div className="flex flex-col items-center gap-sm">
                        <span className="material-symbols-outlined text-4xl text-outline">
                          search_off
                        </span>
                        <p className="font-body-md text-body-md text-on-surface">
                          No invoices found for &quot;{debouncedSearchTerm}
                          &quot;
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Try a different client name or invoice number.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      onClick={() => router.push(`/invoices/${invoice._id}`)}
                      key={invoice?._id.toString()}
                      className="group border-b cursor-pointer border-outline-variant/30 hover:bg-surface-container-lowest/50 transition-colors group"
                    >
                      <td className="py-sm px-lg font-medium text-on-surface">
                        {invoice?.invoiceNumber}
                      </td>
                      <td className="py-sm px-lg">
                        <div className="flex items-center gap-sm">
                          <ClientInitialBadge
                            name={invoice?.client || "Client Name"}
                            size="small"
                          />
                          <span className="text-on-surface">
                            {invoice?.client}
                          </span>
                        </div>
                      </td>
                      <td className="py-sm px-lg text-on-surface-variant">
                        {new Date(invoice?.issueDate).toLocaleDateString(
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
                        <StatusBadge
                          color={
                            invoice.status === "Paid"
                              ? "success"
                              : invoice.status === "pending"
                                ? "normal"
                                : "error"
                          }
                          label={invoice.status}
                          fontSize="small"
                        />
                      </td>
                      <td className=" pr-lg text-right">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirmBox(true);
                            setInvoiceToDelete(invoice._id.toString());
                          }}
                          className="group-hover:opacity-100 opacity-0 transition-all duration-200 hover:text-primary  material-symbols-outlined text-on-surface-variant group-hover:text-on-surface"
                        >
                          delete
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
      {showConfirmBox && (
        <ConfirmationBox
          message="Are you sure you want to delete this invoice?"
          message2="This action can't be undone and will permanently remove the invoice from your records."
          onConfirm={async () => {
            handleDeleteInvoice(invoiceToDelete);
            setShowConfirmBox(false);
          }}
          onCancel={() => setShowConfirmBox(false)}
        />
      )}
    </div>
  );
};

export default Page;
