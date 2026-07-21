"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  getActiveProjects,
  getTotalClients,
  getInvoiceStats,
  getRecentActivities,
} from "@/helpers/dashboardServices";
import { useAsync } from "@/app/hooks/useAsync";
import {  Project, Invoice } from "@/types/Model.types";
import useFetch from "@/app/hooks/useFetch";
import StatusBadge from "@/components/Invoice/StatusBadge";
import { useRouter } from "next/navigation";
import { ActivityItem } from "@/app/api/dashboard/recent-activities/route";
import { useSession } from "next-auth/react";
import {
  InvoiceListSkeleton,
  ProjectListSkeleton,
  RecentActivitySkeleton,
  RevenueChartSkeleton,
  StatCardSkeleton,
} from "@/components/Skeletals/DashBoard";
import { MonthlyRevenue } from "@/app/api/Invoices/stats/route";
type GrowthResult = {
  percentage: number | null; // null = undefined growth, render as "New"
  direction: "up" | "down" | "flat";
};
const Page = () => {
  const router = useRouter();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
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
    paidLastMonth: {
      total: 0,
      count: 0,
    },
    monthlyRevenue: [] as MonthlyRevenue[],
    InvoicesDueThisWeek: [] as Invoice[],
  });
  const session = useSession();
  const getGreeting = () => {
    const user = session?.data?.user?.name;
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return `Good morning, ${user || "there"}`;
    } else if (currentHour < 18) {
      return `Good afternoon, ${user || "there"}`;
    }
    return `Good evening, ${user || "there"}`;
  };
  const [totalClients, setTotalClients] = useState(0);

  const [totalProjects, setTotalProjects] = useState(0);
  const [limit, setLimit] = useState<number>(5);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [projectDueThisMonth, setProjectDueThisMonth] = useState<Project[]>([]);
  
  const [isLoading, setIsLoading] = useState({
    invoices: true,
    paidThisMonth: true,
    projects: true,
    clients: true,
    recentActivities: true,
    projectDueThisMonth: true,
    invoiceDueThisWeek: true,
    revenueChart: true,
    outStanding: true,
  });
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
  const {
    data: recentActivitiesData,
    error: recentActivitiesError,
    isLoading: isRecentActivitiesLoading,
  } = useAsync((signal) => getRecentActivities(signal), []);
  const { data: invoicesData, error: invoicesError, loading: isInvoicesLoading } = useFetch(
    `/api/Invoices?monthRange=1&limit=5&sort=desc&sortBy=issueDate`
  );
  const { data: projectDueThisMonthData, error: projectDueThisMonthError, loading: isProjectDueThisMonthLoading } =
    useFetch(`/api/projects/stats`);
  // useEffect(() => {
  //   if (projectsData) {
  //     setActiveProjects(projectsData.data.projects);
  //     setTotalProjects(projectsData.data.total);
  //     setIsLoading((prev) => ({ ...prev, projects: false }));
  //   }
  //   if (clientsData) {
  //     setTotalClients(clientsData.data.total);
  //     setIsLoading((prev) => ({ ...prev, clients: false }));
  //   }
  //   if (invoiceStatsData) {
  //     setStats(invoiceStatsData.data);
  //     if (invoiceStatsData.data.InvoicesDueThisWeek) {
  //       setIsLoading((prev) => ({ ...prev, invoiceDueThisWeek: false }));
  //     }
  //     if (invoiceStatsData.data.monthlyRevenue) {
  //       setIsLoading((prev) => ({ ...prev, revenueChart: false }));
  //     }
  //     if (
  //       invoiceStatsData.data.paidThisMonth 
  //     ) {
  //       setIsLoading((prev) => ({ ...prev, paidThisMonth: false }));
  //     }
  //     if (invoiceStatsData.data.outstanding) {
  //       setIsLoading((prev) => ({ ...prev, outStanding: false }));
  //     }
      
  //   }
  //   if (invoicesData) {
  //     setInvoices(invoicesData.invoices);
  //     setIsLoading((prev) => ({ ...prev, invoices: false }));
  //   }
  //   if (recentActivitiesData) {
  //     setRecentActivities(recentActivitiesData.data);
  //     setIsLoading((prev) => ({ ...prev, recentActivities: false }));
  //   }
  //   if (projectDueThisMonthData) {
  //     setProjectDueThisMonth(projectDueThisMonthData.projects);
  //     setIsLoading((prev) => ({ ...prev, projectDueThisMonth: false }));
  //   }
  // }, [
  //   projectsData,
  //   clientsData,
  //   invoiceStatsData,
  //   invoicesData,
  //   recentActivitiesData,
  //   projectDueThisMonthData,
  // ]);
  console.log("renders")
  const getBurnRatePercentage = (
    burnRate: number | undefined,
    budget: number
  ) => {
    if (budget === 0 || burnRate === undefined) return 0;
    return (burnRate / budget) * 100;
  };
  const getGrowthResult = (current: number, previous: number): GrowthResult => {
    if (previous === 0) {
      return {
        percentage: current === 0 ? 0 : null,
        direction: current === 0 ? "flat" : "up",
      };
    }

    const percentage = ((current - previous) / Math.abs(previous)) * 100;

    return {
      percentage: Math.abs(Number(percentage.toFixed(1))),
      direction: percentage > 0 ? "up" : percentage < 0 ? "down" : "flat",
    };
  };

  // derived values — no extra render, no effect needed
const growthResult = useMemo<GrowthResult>(() => {
  const stats = invoiceStatsData?.data;
  if (!stats?.paidThisMonth || !stats?.paidLastMonth) {
    return { percentage: null, direction: "flat" };
  }
  return getGrowthResult(stats.paidThisMonth.total, stats.paidLastMonth.total);
}, [invoiceStatsData?.data?.paidThisMonth, invoiceStatsData?.data?.paidLastMonth]);

const max = useMemo(() => {
  const revenue = invoiceStatsData?.data?.monthlyRevenue;
  return revenue?.length ? Math.max(...revenue.map((m: MonthlyRevenue) => m.total)) : 0;
}, [invoiceStatsData?.data?.monthlyRevenue]);
  
  return (
    <main className="flex-1  p-4 md:p-lg lg:p-xl max-w-container-max mx-auto w-full flex flex-col gap-lg md:gap-xl overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            {getGreeting()}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Here's what's happening across your projects
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md md:gap-lg">
        {isInvoiceStatsLoading ? (
          <StatCardSkeleton />
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
              <span className="material-symbols-outlined text-headline-lg">
                payments
              </span>
              Total revenue
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface mb-2">
              {invoiceStatsData?.data?.paidThisMonth?.total?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div
              className={
                "flex items-center gap-1 font-label-sm text-label-sm " +
                (growthResult.direction === "up"
                  ? "text-on-secondary-container"
                  : "text-on-accent-container")
              }
            >
              <span className="material-symbols-outlined text-label-lg">
                {growthResult.direction === "up"
                  ? "trending_up"
                  : growthResult.direction === "down"
                    ? "trending_down"
                    : "remove"}
              </span>
              {growthResult.percentage !== null ? (
                <span
                  className={
                    growthResult.direction === "up"
                      ? "text-on-secondary-container"
                      : "text-on-accent-container"
                  }
                >
                  {growthResult.percentage.toFixed(2)}%
                </span>
              ) : null}
            </div>
          </div>
        )}

        {isInvoiceStatsLoading ? (
          <StatCardSkeleton />
        ) : (
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
              {invoiceStatsData?.data?.outstanding?.total?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              {invoiceStatsData?.data?.outstanding?.count} invoices pending
            </div>
          </div>
        )}

        {isInvoiceStatsLoading ? (
          <StatCardSkeleton />
        ) : (
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
              {projectsData?.data?.total || 0}
            </div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              {projectDueThisMonthData?.projects?.length} due this month
            </div>
          </div>
        )}

        {isClientsLoading ? (
          <StatCardSkeleton />
        ) : (
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
              {clientsData?.data?.total || 0}
            </div>
            
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        {isInvoiceStatsLoading ? (
          <RevenueChartSkeleton />
        ) : (
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Revenue Past 12 Months
              </h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <div className="flex-1 min-h-50 flex flex-col justify-end mt-4">
              <div className="flex items-end justify-between gap-2 md:gap-4 h-48 border-b border-outline-variant pb-2">
                {invoiceStatsData?.data?.monthlyRevenue?.map((monthData :MonthlyRevenue) => (
                  <div
                    key={monthData.month}
                    className={`w-full ${max === monthData.total ? "bg-primary hover:bg-primary-container" : "bg-surface-container hover:bg-surface-container-highest"}  transition-colors rounded-t-sm  group relative`}
                    style={{
                      height: Math.min(
                        (monthData.total / (max > 0 ? max : 1)) * 100,
                        100
                      ),
                    }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
                      {monthData.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-3 font-label-sm text-label-sm text-on-surface-variant px-2">
                {invoiceStatsData?.data?.monthlyRevenue?.map((monthData :MonthlyRevenue) => (
                  <span key={monthData.month}>{monthData.month}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {isRecentActivitiesLoading ? (
          <RecentActivitySkeleton />
        ) : (
          <div className="bg-surface-container-lowest max-h-85 border  border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Recent activity
              </h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
            <div className="flex flex-col gap-5 overflow-auto scrollbar-hide relative">
              <div className="absolute left-3.75 top-4 bottom-4 w-px bg-outline-variant/50 z-0"></div>

              {recentActivitiesData?.data?.length > 0 ? (
                recentActivitiesData?.data?.map((activity : ActivityItem) => (
                  <div key={activity.id} className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0 mt-1">
                      {activity.type === "timelog" ? (
                        <span className="material-symbols-outlined text-headline-sm">
                          schedule
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-headline-sm">
                          receipt
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface">
                        {activity.message}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                        {new Date(activity.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                        }) +
                          " at " +
                          new Date(activity.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-20">
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    No recent activities has been recorded.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 h-auto lg:grid-cols-2 gap-md md:gap-lg mb-xl">
        {isProjectsLoading ? (
          <ProjectListSkeleton />
        ) : (
          <div className="bg-surface-container-lowest border max-h-90  border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Active projects
              </h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="flex flex-col gap-5 overflow-auto scrollbar-hide">
              <div>
                <div className="flex flex-col gap-md justify-center items-start  mb-2">
                  {projectsData?.data?.projects?.length > 0 ? (
                    projectsData?.data?.projects?.map((project : Project) => (
                      <div
                        key={project._id.toString()}
                        className="flex cursor-pointer gap-2 group items-center w-full justify-start  mb-2"
                        onClick={() => router.push(`/projects/${project._id}`)}
                      >
                        <div className="w-10 grop-hover:text-primary h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-headline-sm">
                            folder
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
                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                              {getBurnRatePercentage(
                                project.burnRate,
                                project.budget
                              ).toFixed(2)}
                              % of budget used
                            </p>
                            <div
                              className={`relative mt-2 h-1 w-50 rounded-full overflow-hidden  bg-stone-300`}
                            >
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
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-20">
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        No active projects found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className=" text-center">
              {projectsData?.data.projects.length === projectsData?.data.total ? (
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
        )}
        {isProjectDueThisMonthLoading ? (
          <ProjectListSkeleton />
        ) : (
          <div className="bg-surface-container-lowest border   border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Project Due this Month
              </h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="flex flex-col gap-5 overflow-auto scrollbar-hide">
              <div>
                <div className="flex flex-col gap-md justify-center items-start  mb-2">
                  {projectDueThisMonthData?.projects?.length > 0 ? (
                    projectDueThisMonthData?.projects?.map((project : Project) => (
                      <div
                        key={project._id.toString()}
                        className="flex cursor-pointer gap-2 group items-center w-full justify-start  mb-2"
                        onClick={() => router.push(`/projects/${project._id}`)}
                      >
                        <div className="w-10 grop-hover:text-primary h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-headline-sm">
                            folder
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
                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                              {getBurnRatePercentage(
                                project.burnRate,
                                project.budget
                              ).toFixed(2)}
                              % of budget used
                            </p>
                            <div
                              className={`relative mt-2 h-1 w-50 rounded-full overflow-hidden  bg-stone-300`}
                            >
                              <div
                                className="absolute bg-primary inset-y-0 left-0 rounded-full opacity-100"
                                style={{
                                  width: `${getBurnRatePercentage(project.burnRate, project.budget)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-20">
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        No projects due this month.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isInvoiceStatsLoading? (
          <InvoiceListSkeleton />
        ) : (
          <div className="bg-surface-container-lowest border max-h-90  border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Invoices Due this Week
              </h3>
              <a
                className="font-label-sm text-label-sm text-primary hover:underline"
                href="#"
              >
                View all
              </a>
            </div>
            <div className="flex scrollbar-hide overflow-auto flex-col gap-4">
              {invoiceStatsData?.data?.InvoicesDueThisWeek?.length > 0 ? (
                invoiceStatsData?.data?.InvoicesDueThisWeek?.map((invoice : Invoice) => (
                  <div
                    key={invoice._id.toString()}
                    className="flex justify-between items-center group cursor-pointer"
                    onClick={() => {
                      router.push(`/invoices/${invoice._id}`);
                    }}
                  >
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
                          {invoice.client}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          INV-{invoice.invoiceNumber} •{" "}
                          {new Date(invoice.issueDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
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
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-20">
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    No recent invoices found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {isInvoicesLoading ? (
          <InvoiceListSkeleton />
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Recent Invoices
              </h3>
              <a
                className="font-label-sm text-label-sm text-primary hover:underline"
                href="#"
              >
                View all
              </a>
            </div>
            <div className="flex flex-col gap-4">
              {invoicesData?.invoices?.length > 0 ? (
                invoicesData?.invoices?.map((invoice : Invoice) => (
                  <div
                    key={invoice._id.toString()}
                    className="flex justify-between items-center group cursor-pointer"
                    onClick={() => {
                      router.push(`/invoices/${invoice._id}`);
                    }}
                  >
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
                          {invoice.client}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          INV-{invoice.invoiceNumber} •{" "}
                          {new Date(invoice.issueDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
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
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-20">
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    No recent invoices found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
