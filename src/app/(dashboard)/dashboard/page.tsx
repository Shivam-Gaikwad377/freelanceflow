"use client";
import React, { useEffect, useState } from "react";
import {
  getActiveProjects,
  getTotalClients,
  getInvoiceStats,
} from "@/helpers/dashboardServices";
import { useAsync } from "@/app/hooks/useAsync";
import { IProject } from "@/schemas/project.schema";

const page = () => {
  const [activeProjects, setActiveProjects] = useState<IProject[]>([]);
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
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(" ");
  const [totalProjects, setTotalProjects] = useState(0);
  const [limit, setLimit] = useState<number>(5);
  const {
    data: projectsData,
    error: projectsError,
    isLoading: isProjectsLoading,
  } = useAsync((signal) => getActiveProjects(limit, signal), [limit]);
  const {
    data: clientsData,
    error: clientsError,
    isLoading: isClientsLoading,
  } = useAsync((signal) => getTotalClients(signal), []);
  const {
    data: invoiceStatsData,
    error: invoiceStatsError,
    isLoading: isInvoiceStatsLoading,
  } = useAsync((signal) => getInvoiceStats(signal), []);
  useEffect(() => {
    if (projectsData) {
      setActiveProjects(projectsData.data.projects);
      setTotalProjects(projectsData.data.total);
    }
    if (clientsData) {
      setTotalClients(clientsData.data.total);
    }
    if (invoiceStatsData) {
      setStats(invoiceStatsData.data);
    }
    setLoading(isProjectsLoading || isClientsLoading || isInvoiceStatsLoading);
  }, [projectsData, clientsData, invoiceStatsData]);
  const getBurnRatePercentage = (
    burnRate: number | undefined,
    budget: number
  ) => {
    if (budget === 0 || burnRate === undefined) return 0;
    return (burnRate / budget) * 100;
  };

  return (
    <main className="flex-1  p-4 md:p-lg lg:p-xl max-w-container-max mx-auto w-full flex flex-col gap-lg md:gap-xl overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            Good afternoon, Shivam
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Here's what's happening across your projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              calendar_today
            </span>
            Last 30 days
          </button>
          <button className="h-10 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              add
            </span>
            New invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md md:gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              payments
            </span>
            Total revenue
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface mb-2">
            {stats?.paidThisMonth?.total?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "14px" }}
            >
              trending_up
            </span>
            +12% vs last month
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              schedule
            </span>
            Outstanding
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface mb-2">
            {stats?.outstanding?.total?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
            {stats?.outstanding?.count} invoices pending
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              work
            </span>
            Active projects
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface mb-2">
            {totalProjects}
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
            2 due this week
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              group
            </span>
            Total clients
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface mb-2">
            {totalClients}
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
            3 new this month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Revenue overview
            </h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          <div className="flex-1 min-h-50 flex flex-col justify-end mt-4">
            <div className="flex items-end justify-between gap-2 md:gap-4 h-48 border-b border-outline-variant pb-2">
              <div className="w-full bg-surface-container hover:bg-surface-container-highest transition-colors rounded-t-sm h-[40%] group relative">
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                  ₹45k
                </div>
              </div>
              <div className="w-full bg-surface-container hover:bg-surface-container-highest transition-colors rounded-t-sm h-[55%] group relative">
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                  ₹62k
                </div>
              </div>
              <div className="w-full bg-surface-container hover:bg-surface-container-highest transition-colors rounded-t-sm h-[48%] group relative">
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                  ₹54k
                </div>
              </div>
              <div className="w-full bg-surface-container hover:bg-surface-container-highest transition-colors rounded-t-sm h-[75%] group relative">
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                  ₹85k
                </div>
              </div>
              <div className="w-full bg-primary hover:bg-primary/90 transition-colors rounded-t-sm h-[90%] group relative shadow-[0_0_15px_rgba(70,72,212,0.3)]">
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                  ₹102k
                </div>
              </div>
              <div className="w-full bg-surface-container hover:bg-surface-container-highest transition-colors rounded-t-sm h-[65%] group relative">
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                  ₹74k
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-3 font-label-sm text-label-sm text-on-surface-variant px-2">
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Recent invoices
            </h3>
            <a
              className="font-label-sm text-label-sm text-primary hover:underline"
              href="#"
            >
              View all
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    receipt
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Acme Studio
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    INV-0231
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#166534] font-label-sm text-label-sm uppercase tracking-wider text-[10px]">
                Paid
              </span>
            </div>

            <div className="flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    receipt
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Nova Retail
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    INV-0230
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#fef08a] text-[#854d0e] font-label-sm text-label-sm uppercase tracking-wider text-[10px]">
                Pending
              </span>
            </div>

            <div className="flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    receipt
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Bloom Agency
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    INV-0229
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm uppercase tracking-wider text-[10px]">
                Overdue
              </span>
            </div>

            <div className="flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    receipt
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Kite Labs
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    INV-0228
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#166534] font-label-sm text-label-sm uppercase tracking-wider text-[10px]">
                Paid
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 h-auto lg:grid-cols-2 gap-md md:gap-lg mb-xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Active projects
            </h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex flex-col gap-md justify-center items-start  mb-2">
                {activeProjects.map((project) => (
                  <div
                    key={project._id.toString()}
                    className="flex gap-2 items-center w-full justify-start  mb-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        receipt
                      </span>
                    </div>
                    <div>
                      <p className="font-headline-sm text-label-md text-on-surface">
                        {project.title}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {project.client}
                      </p>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{getBurnRatePercentage(project.burnRate, project.budget).toFixed(2)}% of budget used</p>
                        <div className={`relative mt-2 h-1 w-50 rounded-full overflow-hidden  bg-stone-300`} >
                        
                        <div
                          className="absolute inset-y-0 left-0 rounded-full opacity-100"
                          style={{
                            width: `${getBurnRatePercentage(project.burnRate, project.budget)}%`,
                            background: `linear-gradient(to right, #3b82f6, #6366f1)`,
                          }}
                        />
                                            </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className=" text-center">
            {activeProjects.length === totalProjects ? (
              <button
                onClick={() => setLimit(5)}
                className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                View Less
              </button>
            ) : (
              <button
                onClick={() => setLimit(totalProjects)}
                className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                View All Projects
              </button>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest min-h-70 max-h-80 border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Recent activity
            </h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <div className="flex flex-col gap-5 relative">
            <div className="absolute left-3.75 top-4 bottom-4 w-px bg-outline-variant/50 z-0"></div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0 mt-1">
                NR
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <span className="font-semibold text-on-surface">
                    Nova Retail
                  </span>
                  added a new project
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  2 hours ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0 mt-1">
                KL
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <span className="font-semibold text-on-surface">
                    Kite Labs
                  </span>
                  paid invoice
                  <a className="text-primary hover:underline" href="#">
                    INV-0228
                  </a>
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  Yesterday, 4:30 PM
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0 mt-1">
                BA
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <span className="font-semibold text-on-surface">
                    Bloom Agency
                  </span>
                  added as a client
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  3 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
