"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import EditProjectDrawer from "@/components/Project/EditProject";
import { toast } from "sonner";
import { useUiStore } from "@/store/useUiStore";
import useFetch from "@/app/hooks/useFetch";
import BackButton from "@/components/BackButton";
import { IInvoice } from "@/schemas/createInvoice.schema";
import { IProject } from "@/schemas/project.schema";
import { IClient } from "@/schemas/createClient.schema";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import StatusBadge from "@/components/Invoice/StatusBadge";
import ClientInitialBadge from "@/components/Client/ClientInitialBadge";

import TasksTable from "@/components/Tasks/TasksTable";
import TimeLog from "@/models/timeLog.model";
import TimeLogTable from "@/components/TimeLogs/TimeLogTable";

const Page = () => {
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
            project={project}
          />
        </div>
        {/* <!-- Breadcrumbs --> */}
        <div className="flex justify-between items-center mb-xl">
          <BackButton
            onBack={() => router.push("/projects")}
            label="Back to Projects"
          />

          <div className="flex gap-md">
            <SecondaryButton
              label="Edit Project"
              icon="edit"
              onClick={() => setEdit(true)}
            />

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
                  <StatusBadge
                    color={
                      project?.status === "completed"
                        ? "success"
                        : project?.status === "in progress"
                          ? "error"
                          : "normal"
                    }
                    label={project?.status}
                    fontSize="large"
                  />
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
                    {project?.budget.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
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
                      {project.StartedAt
                        ? new Date(project?.StartedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Not Started Yet"}
                    </p>
                  ) : (
                    <SecondaryButton
                      label="Start Project"
                      onClick={handleStartProject}
                      icon=""
                    />
                  )}
                </div>
                <div className="flex items-start flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Deadline
                  </p>
                  <p className="font-body-md font-semibold text-tertiary">
                    {project?.deadline
                      ? new Date(project.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "No deadline set"}
                  </p>
                </div>
                <div className="flex items-start flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">
                    Time Elapsed
                  </p>
                  <p className="font-body-md font-semibold">
                    {project?.status === "in progress" ||
                    project?.status === "completed"
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
              <TasksTable projectId={id || ""} />

            
          </div>

          <div className="col-span-4 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <h4 className="font-label-md text-on-surface-variant uppercase mb-md">
                Client Contact
              </h4>
              <div
                onClick={() => router.replace(`/clients/${client?._id}`)}
                className=" cursor-pointer flex items-center gap-md mb-lg"
              >
                <ClientInitialBadge
                  name={client?.name || "Client Name"}
                  size="medium"
                />
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
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden card-shadow">
              <div className="p-md flex justify-between items-center border-b border-outline-variant/30">
                <h3 className="font-label-md text-on-surface font-semibold">
                  Invoices Summary
                </h3>
                <SecondaryButton
                  label="Add Invoice"
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
                  icon="add"
                  fontSize="small"
                />
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant text-label-sm border-b border-outline-variant/30">
                  <tr>
                    <th className="p-3 font-semibold">Invoice #</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Due Date</th>
                    <th className="p-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm text-on-surface">
                  {invoices?.map((invoice) => (
                    <tr
                      onClick={() =>
                        router.replace(`/invoices/${invoice?._id}`)
                      }
                      key={invoice._id.toString()}
                      className="border-b  hover:bg-surface-container/50 border-outline-variant/10  transition-colors"
                    >
                      <td className="p-3  font-label-md text-on-surface font-medium">
                        {invoice?.invoiceNumber}
                      </td>
                      <td className="p-3  text-on-surface-variant font-body-sm">
                        {new Date(invoice?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-3 ">
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
                      <td className="p-3 text-right font-medium text-on-surface">
                        {invoice?.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-md text-center">
                {invoices.length === invoicesTotal ? (
                  <button
                    onClick={() => setInvoicesLimit(invoicesTotal-2)}
                    className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    View Less
                  </button>
                ) : (
                  <button
                    onClick={() => setInvoicesLimit(invoicesTotal)}
                    className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    View All Invoices
                  </button>
                )}
              </div>
            </div>
            <TimeLogTable projectId={id?.toString() || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
