"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const page = () => {
  const session = useSession();
  const [client, setClient] = useState<any>(null);
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  useEffect(() => {
    const fetchClient = async () => {
      if (session) {
        try {
          const response = await axios.get(`/api/Clients/${id}`);
          setClient(response.data.data.client);
        } catch (error) {
          console.error("Error fetching client:", error);
        }
      }
    }
    fetchClient();
  }, [id]);
  const totalBilled = 12450.0; // Placeholder for total billed amount, replace with actual data from API
  const outstandingBalance = 3200.0; // Placeholder for outstanding balance, replace with actual data from API
  const router = useRouter();
  return (
    <body className="bg-background text-on-surface font-body-md antialiased min-h-screen flex selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        {/* TopAppBar (Shared Component) */}
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant z-10 flex justify-between items-center px-lg transition-all">
          <TopNavbar />
        </header>
        {/* <!-- Scrollable Content Canvas --> */}
        <main className="flex-1 overflow-y-auto pt-24 pb-xxl px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
          {/* <!-- Breadcrumbs --> */}
          <button className="flex items-center gap-1 px-2 py-1 -ml-2 mb-2 text-primary font-label-md text-label-md hover:bg-surface-container-high rounded-lg transition-colors group">
            <span className="material-symbols-outlined text-[20px]">
              chevron_left
            </span>
            <span className="">Back to Clients</span>
          </button>
          <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-6">
            <a className="hover:text-primary transition-colors" href="#">
              Clients
            </a>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-on-surface font-semibold">Acme Corp</span>
          </nav>
          {/* <!-- 1. Client Information Header (Bento/Card Style) --> */}
          <section className="bg-surface-container-lowest rounded-[16px] border border-outline-variant p-lg md:p-xl mb-xl shadow-sm relative overflow-hidden">
            {/* Subtle decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              {/* Left: Identity */}
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/50 shrink-0">
                  {/* Placeholder for Client Logo */}
                  <span className="font-display text-headline-lg font-bold text-primary">
                    A
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-display text-headline-lg font-bold text-on-surface tracking-tight">
                      {client?.company || "Client Name"}
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                      {client?.status || "Status"}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    {client?.description || "Company Description"}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">
                        person
                      </span>
                      <span className="font-label-md text-label-md">
                        {client?.name || "Jane Doe (Director of Product)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">
                        mail
                      </span>
                      <a
                        className="font-label-md text-label-md hover:text-primary transition-colors"
                        href={`mailto:${client?.email || "jane@acme.corp"}`}
                      >
                        {client?.email || "jane@acme.corp"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">
                        phone
                      </span>
                      <a
                        className="font-label-md text-label-md hover:text-primary transition-colors"
                        href={`tel:${client?.phone || "+15551234567"}`}
                      >
                       {client?.phone || "+1 (555) 123-4567"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Quick Actions / Metrics */}
              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-outline-variant text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                    Edit Client
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    New Project
                  </button>
                </div>
                <div className="flex gap-6 mt-2">
                  <div className="text-left md:text-right">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Lifetime Value
                    </p>
                    <p className="font-display text-headline-md font-bold text-on-surface">
                      {totalBilled.toLocaleString("en-US", {
                        style: "currency",
                        currency: session?.data?.user?.currency || "USD",
                      })}
                    </p>
                  </div>
                  <div className="w-px bg-outline-variant h-full hidden md:block"></div>
                  <div className="text-left md:text-right">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Outstanding
                    </p>
                    <p className="font-display text-headline-md font-bold text-tertiary">
                      {outstandingBalance.toLocaleString("en-US", {
                        style: "currency",
                        currency: session?.data?.user?.currency || "USD",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 2. Project History Section */}
          <section className="mb-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-headline-sm font-semibold text-on-surface">
                Project History
              </h3>
              <button className="text-primary font-label-md text-label-md hover:underline hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-[16px] border border-outline-variant shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Project Name
                      </th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Status
                      </th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Start Date
                      </th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface">
                    <tr className="border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                          Website Redesign 2024
                        </div>
                        <div className="text-on-surface-variant mt-0.5">
                          Marketing Dept
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-primary font-label-sm text-label-sm border border-primary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          In Progress
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        Oct 12, 2023
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md">
                        {totalBilled.toLocaleString("en-US", {
                          style: "currency",
                          currency: session?.data?.user?.currency || "USD",
                        })}
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                          Q3 Mobile App Audit
                        </div>
                        <div className="text-on-surface-variant mt-0.5">
                          Product Team
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-secondary font-label-sm text-label-sm border border-secondary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Completed
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        Jul 01, 2023
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md">
                        $8,500
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-highest/30 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                          Design System Setup
                        </div>
                        <div className="text-on-surface-variant mt-0.5">
                          Engineering
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-secondary font-label-sm text-label-sm border border-secondary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Completed
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        Mar 15, 2023
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md">
                        $22,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* <!-- 3. Invoices Section --> */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-headline-sm font-semibold text-on-surface">
                Recent Invoices
              </h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant text-on-surface font-label-sm text-label-sm rounded-lg hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  filter_list
                </span>
                Filter
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-[16px] border border-outline-variant shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Invoice #
                      </th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Date Issued
                      </th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Status
                      </th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                        Amount
                      </th>
                      <th className="py-3 px-6 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface">
                    {/* <!-- Overdue Invoice --> */}
                    <tr className="border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group">
                      <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                        INV-2023-089
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        Sep 30, 2023
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/50 text-on-error-container font-label-sm text-label-sm border border-error/20">
                          Overdue
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md text-on-surface">
                        $3,200.00
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined">
                            download
                          </span>
                        </button>
                      </td>
                    </tr>
                    {/* <!-- Pending Invoice --> */}
                    <tr className="border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group">
                      <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                        INV-2023-094
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        Oct 15, 2023
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm border border-outline-variant">
                          Pending
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md text-on-surface">
                        $4,500.00
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined">
                            download
                          </span>
                        </button>
                      </td>
                    </tr>
                    {/* <!-- Paid Invoice --> */}
                    <tr className="hover:bg-surface-container-highest/30 transition-colors group">
                      <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                        INV-2023-072
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        Aug 01, 2023
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-secondary font-label-sm text-label-sm border border-secondary/20">
                          Paid
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md text-on-surface-variant line-through opacity-70">
                        $8,500.00
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined">
                            download
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </body>
  );
};

export default page;
