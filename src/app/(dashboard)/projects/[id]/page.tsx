"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import EditProjectDrawer from "@/components/EditProject";
import { toast } from "sonner";
type StatusColor = {
  [key: string]: string;
};
const page = () => {
  const clientInitialsColor: StatusColor = {
    A: "bg-amber-200", // Amber
    B: "bg-blue-200", // Blue
    C: "bg-cyan-200", // Cyan
    D: "bg-slate-200", // Denim / Dark Slate
    E: "bg-emerald-200", // Emerald
    F: "bg-fuchsia-200", // Fuchsia
    G: "bg-green-200", // Green
    H: "bg-yellow-200", // Honey
    I: "bg-indigo-200", // Indigo
    J: "bg-teal-200", // Jade
    K: "bg-stone-200", // Khaki
    L: "bg-lime-200", // Lime
    M: "bg-rose-200", // Magenta / Maroon
    N: "bg-blue-100", // Navy (Soft tint)
    O: "bg-orange-200", // Orange
    P: "bg-purple-200", // Purple
    Q: "bg-zinc-200", // Quartz
    R: "bg-red-200", // Red
    S: "bg-sky-200", // Sky
    T: "bg-teal-100", // Teal
    U: "bg-indigo-100", // Ultramarine (Soft tint)
    V: "bg-violet-200", // Violet
    W: "bg-rose-100", // Wine (Soft tint)
    X: "bg-lime-100", // Xanthic
    Y: "bg-yellow-100", // Yellow
    Z: "bg-zinc-100",
  };
  const [project, setProject] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesTotal, setInvoicesTotal] = useState<number>(0);
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [start, setStart] = useState(new Date());
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [viewAll, setViewAll] = useState(false);
  const [edit, setEdit] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await axios.get(`/api/projects/${id}`);
        setProject(projectResponse.data.data);
        if (projectResponse.data.data.isStarted) {
          setStart(projectResponse.data.data.StartedAt);
          const diffInMs =
            Date.now() -
            new Date(projectResponse.data.data.StartedAt).getTime();
          setTimeElapsed(Math.floor(diffInMs / 86_400_000));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientResponse = await axios.get(
          `/api/Clients/${project.clientID}`
        );
        setClient(clientResponse.data.data);
        console.log("Fetched client data:", clientResponse.data.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClient();
  }, [project?.clientID]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `/api/Invoices?projectId=${id}&searchBy=project`
        );
        setInvoices(response.data.data.invoices);
        setInvoicesTotal(response.data.data.total);
        console.log("Fetched invoices:", response.data.data.invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, [id]);
  const handleStartProject = async () => {
    try {
      const response = await axios.patch(`/api/projects/${id}`, {
        isStarted: true,
        StartedAt: new Date(),
        status: "in progress",
      });
      setProject(response.data.data);
    } catch (error) {
      console.error("Error starting project:", error);
    }
  };

  const handleViewAllInvoices = async () => {
    setViewAll(true);
    try {
      const response = await axios.get(
        `/api/Invoices?projectId=${id}&searchBy=project&limit=${invoicesTotal}`
      );
      setInvoices(response.data.data.invoices);
      setInvoicesTotal(response.data.data.total);
      console.log("Fetched invoices:", response.data.data.invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  const handleMarkAsDone = async () => {
    try {
      const response = await axios.patch(`/api/projects/${id}`, {
        status: "completed",
        
      });
      if(response.data.success) {
        setProject(response.data.data);
        router.refresh();
        toast.success("Project marked as completed");
      }
      
    } catch (error) {
      console.error("Error marking project as done:", error);
    }
  };
  return (
    <div className="flex-1 flex flex-col min-w-0 relative">
      <div
        className={` flex-1 overflow-y-auto p-10  md:px-gutter max-w-container-max mx-auto w-full`}
      >
        <div>
          <EditProjectDrawer
            open={edit}
            onClose={() => {
              setEdit(false);
            }}
            project={project}
          />
        </div>
        {/* <!-- Breadcrumbs --> */}
        <div className="flex justify-between items-center mb-xl">
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-md">
            <a
              className="hover:text-primary transition-colors flex items-center gap-1"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back_ios
              </span>
              Projects
            </a>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold">
              {project?.title}
            </span>
          </nav>
          <div className="flex gap-md">
            <button
              className="px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-all flex items-center gap-2"
              onClick={() => setEdit(true)}
            >
              <span className="material-symbols-outlined text-[20px]">
                edit
              </span>
              Edit Project
            </button>
            {!(project?.status === "completed") && (
              <button onClick={handleMarkAsDone} className="px-md py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md transition-all flex items-center gap-2 shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">
                  check_circle
                </span>
                Mark as Done
              </button>
            )}
          </div>
        </div>
        {/* <!-- 1. Client Information Header (Bento/Card Style) --> */}
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-8 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="flex justify-between items-start relative z-9">
                <div>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm uppercase tracking-wider mb-sm inline-block">
                    In Progress
                  </span>
                  <h2 className="font-display text-headline-lg text-on-surface mt-2">
                    {project?.title}
                  </h2>
                  <div className="flex items-center gap-md mt-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                      <span className="font-body-md font-semibold">
                        {project?.client}
                      </span>
                    </div>
                    <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        business
                      </span>
                      <span className="font-body-md">{client?.company}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Total Budget
                  </p>
                  <h3 className="font-display text-headline-md text-primary">
                    {project?.budget}
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-lg border-t border-outline-variant/30 pt-lg relative z-9">
                <div className="flex items-start flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Start Date
                  </p>
                  {project?.isStarted ? (
                    <p className="font-body-md font-semibold ">
                      {new Date(project?.StartedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  ) : (
                    <button
                      className="px-md py-2 border -ms-md border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-all flex items-center gap-2"
                      onClick={handleStartProject}
                    >
                      Start Project
                    </button>
                  )}
                </div>
                <div className="flex items-start flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Deadline
                  </p>
                  <p className="font-body-md font-semibold text-tertiary">
                    {new Date(project?.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-start flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Time Elapsed
                  </p>
                  <p className="font-body-md font-semibold">
                    {project?.isStarted
                      ? `Time Elapsed: ${timeElapsed.toFixed(0)} days`
                      : "Project not started"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-lg">
              <div>
                <h4 className="font-headline-sm text-on-surface mb-md">
                  Project Description
                </h4>
                <p className="text-on-surface-variant font-body-md leading-relaxed">
                  {project?.description}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-lg flex justify-between items-center border-b border-outline-variant">
                <h4 className="font-headline-sm text-on-surface">
                  Associated Invoices
                </h4>
                <button className="text-primary font-label-md hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                  Create Invoice
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low text-on-surface-variant text-label-sm uppercase">
                    <tr>
                      <th className="px-lg py-4 font-semibold">Invoice #</th>
                      <th className="px-lg py-4 font-semibold">Date</th>
                      <th className="px-lg py-4 font-semibold">Status</th>
                      <th className="px-lg py-4 font-semibold text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {invoices?.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="hover:bg-surface-container/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-lg py-4 font-label-md text-on-surface font-semibold">
                          {invoice?.invoiceNumber}
                        </td>
                        <td className="px-lg py-4 text-on-surface-variant font-body-sm">
                          {new Date(invoice?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-lg py-4">
                          <span className="bg-secondary-container/20 text-on-secondary-container px-2 py-1 rounded text-[11px] font-bold uppercase">
                            {invoice?.status}
                          </span>
                        </td>
                        <td className="px-lg py-4 text-right font-semibold text-on-surface">
                          {invoice?.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-md text-center">
                <button
                  onClick={handleViewAllInvoices}
                  className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  View All Invoices
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <h4 className="font-label-md text-on-surface-variant uppercase mb-md">
                Client Contact
              </h4>
              <div className="flex items-center gap-md mb-lg">
                <div
                  className={`${clientInitialsColor[client?.name.charAt(0).toUpperCase()]} w-14 h-14 rounded-full flex items-center font-bold text-xl justify-center object-cover border  border-surface-variant`}
                >
                  {client?.name.charAt(0).toUpperCase() +
                    client?.name
                      .split(" ")
                      .slice(-1)[0]
                      .charAt(0)
                      .toUpperCase()}
                </div>
                <div>
                  <p className="font-headline-sm text-on-surface">
                    {client?.name || "Client Name"}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    {client?.company}
                  </p>
                </div>
              </div>
              <div className="space-y-sm">
                <button className="w-full flex items-center gap-3 p-3 bg-surface-container-low hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors group">
                  <span className="material-symbols-outlined group-hover:text-primary">
                    mail
                  </span>
                  <span className="font-body-sm">
                    {client?.email || "jane.doe@acme.com"}
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-surface-container-low hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors group">
                  <span className="material-symbols-outlined group-hover:text-primary">
                    call
                  </span>
                  <span className="font-body-sm">
                    {client?.phone || "+1 (555) 012-3456"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
