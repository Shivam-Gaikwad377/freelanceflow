"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import EditProjectDrawer from "@/components/EditProject";
import { toast } from "sonner";
import { useUiStore } from "@/store/useUiStore";
import useFetch from "@/app/hooks/useFetch";
import BackButton from "@/components/BackButton";
import { IInvoice } from "@/schemas/createInvoice.schema";
import { IProject } from "@/schemas/project.schema";
import { IClient } from "@/schemas/createClient.schema";
import PrimaryButton from "@/components/PrimaryButton";
type StatusColor = {
  [key: string]: string;
};
const Page = () => {
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
  const [project, setProject] = useState<IProject | null>(null);
  const { openModal } = useUiStore();
  const [client, setClient] = useState<IClient | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [invoicesTotal, setInvoicesTotal] = useState<number>(0);
  const [invoicesLimit, setInvoicesLimit] = useState<number>(4);
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [edit, setEdit] = useState(false);
  const router = useRouter();
  const { data: projectData, error: projectError } = useFetch(
    `/api/projects/${id}`
  );
  const { data: invoicesData, error: invoicesError } = useFetch(
    `/api/Invoices?projectId=${id}&limit=${invoicesLimit}`
  );

  useEffect(() => {
    if (projectData) {
      setProject(projectData);
      setClient(projectData?.clientId);
    }
    if (invoicesData) {
      setInvoices(invoicesData?.invoices);
      setInvoicesTotal(invoicesData?.total);
    }
  }, [projectData, invoicesData]);

  const handleStartProject = async () => {
    try {
      const response = await axios.patch(`/api/projects/${id}`, {
        StartedAt: new Date(),
        status: "in progress",
      });
      setProject(response.data.data);
    } catch (error) {
      console.error("Error starting project:", error);
    }
  };
  const handleMarkAsDone = async () => {
    try {
      const response = await axios.patch(`/api/projects/${id}`, {
        status: "completed",
      });
      if (response.data.success) {
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
            project={project }
          />
        </div>
        {/* <!-- Breadcrumbs --> */}
        <div className="flex justify-between items-center mb-xl">
          <BackButton
            onBack={() => router.push("/projects")}
            label="Back to Projects"
          />

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
              <PrimaryButton
                label="Mark as Done"
                onClick={handleMarkAsDone}
                icon="check_circle"
              />
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
                    {project?.status}
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
                  {project?.status === "in progress" ||
                  project?.status === "completed" ? (
                    <p className="font-body-md font-semibold ">
                     {project.StartedAt ? (new Date(project?.StartedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )) : ("Not Started Yet")}
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
                    {project?.deadline ? (new Date(project.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })) : ("No deadline set")}
                  </p>
                </div>
                <div className="flex items-start flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Time Elapsed
                  </p>
                  <p className="font-body-md font-semibold">
                    {project?.status === "in progress" || project?.status === "completed"
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
                <button
                  onClick={() =>
                    openModal("addInvoice", {
                      prefillProject: {
                        name: project?.title.toString(),
                        id: project?._id.toString(),
                        clientId: project?.clientId,
                        client: project?.client,
                      },
                    })
                  }
                  className="text-primary font-label-md hover:underline flex items-center gap-1"
                >
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
                        onClick={() =>
                          router.replace(`/invoices/${invoice?._id}`)
                        }
                        key={invoice._id.toString()}
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
                  onClick={() => setInvoicesLimit(invoicesTotal)}
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
              <div
                onClick={() => router.replace(`/clients/${project?.clientId}`)}
                className=" cursor-pointer flex items-center gap-md mb-lg"
              >
                <div
                  className={`${clientInitialsColor[client?.name?.charAt(0)?.toUpperCase() || ""]} w-14 h-14 rounded-full flex items-center font-bold text-xl justify-center object-cover border  border-surface-variant`}
                >
                    {client ?  (client?.name?.charAt(0)?.toUpperCase() +
                      client?.name
                        .split(" ")
                        .slice(-1)[0]
                        .charAt(0)
                        .toUpperCase()): ("CL")}
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

export default Page;
