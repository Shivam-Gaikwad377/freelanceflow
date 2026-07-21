"use client";
import React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useUiStore } from "@/store/useUiStore";
import { toast } from "sonner";
import EditClientDrawer from "@/components/Client/EditClient";

import useFetch from "@/app/hooks/useFetch";
import BackButton from "@/components/BackButton";
import { Client, Project, Invoice } from "@/types/Model.types";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import StatusBadge from "@/components/Invoice/StatusBadge";
import ClientInitialBadge from "@/components/Client/ClientInitialBadge";
import ConfirmationBox from "@/components/confirmationBox";
import {
  ClientHeaderSkeleton,
  InvoiceTableSkeleton,
  ProjectTableSkeleton,
} from "@/components/Skeletals/Client";
import { useDelete } from "@/app/hooks/useDelete";

const Page = () => {
  const { openModal } = useUiStore();
  const session = useSession();
  const [client, setClient] = useState<Client | null>(null);
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [invoiceOffset, setInvoiceOffset] = useState<number>(0);
  const [projectOffset, setProjectOffset] = useState<number>(0);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();
  const limit = 5;
  const [invoiceTotal, setInvoiceTotal] = useState<number>(0);
  const [projectTotal, setProjectTotal] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projectToBeDeleted, setProjectToBeDeleted] = useState<string | null>(
    null
  );
  const [invoiceToBeDeleted, setInvoiceToBeDeleted] = useState<string | null>(
    null
  );
  const [showProjectDeleteConfirmation, setShowProjectDeleteConfirmation] =
    useState(false);
  const [showInvoiceDeleteConfirmation, setShowInvoiceDeleteConfirmation] =
    useState(false);

  const {
    data: clientData,
    loading: clientLoading,
    error: clientError,
  } = useFetch(`/api/Clients/${id}`);

  const [projects, setProjects] = useState<Project[]>([]);
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useFetch(
    `/api/projects?clientId=${id}&offset=${projectOffset}&limit=${limit}`
  );

  const {
    data: invoiceData,
    loading: invoiceLoading,
    error: invoiceError,
  } = useFetch(
    `/api/Invoices?searchBy=clientId&search=${id}&offset=${invoiceOffset}&limit=${limit}`
  );

  const { deleteItem: deleteProject, isDeleting: isDeletingProject } =
    useDelete<Project>({
      resource: "projects",
      setItems: setProjects,
      successMessage: "Project deleted successfully",
      errorMessage: "Failed to delete project",
    });

  const { deleteItem: deleteInvoice, isDeleting: isDeletingInvoice } =
    useDelete<Invoice>({
      resource: "Invoices",
      setItems: setInvoices,
      successMessage: "Invoice deleted successfully",
      errorMessage: "Failed to delete invoice",
    });

  
  useEffect(() => {
    setInvoiceOffset(0);
    setProjectOffset(0);
  }, [id]);

  const handleConfirm = async () => {
    if (projectToBeDeleted) {
      deleteProject(projectToBeDeleted);
      setShowProjectDeleteConfirmation(false);
      setProjectToBeDeleted(null);
    }
    if (invoiceToBeDeleted) {
      deleteInvoice(invoiceToBeDeleted);
      setShowInvoiceDeleteConfirmation(false);
      setInvoiceToBeDeleted(null);
    }
  };
  useEffect(() => {
    if (clientError) {
      toast.error("Failed to fetch client data. Please try again.");
    }
    if (projectError) {
      toast.error("Failed to fetch project data. Please try again.");
    }
    if (invoiceError) {
      toast.error("Failed to fetch invoice data. Please try again.");
    }
  }, [clientError, projectError, invoiceError]);

  return (
    <div className="flex-1 flex flex-col min-w-0 relative">
      <div>
        <EditClientDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          client={client}
        />
      </div>
      {/* <!-- Scrollable Content Canvas --> */}
      <div
        className={`${editOpen ? "blur-sm" : ""} flex-1 overflow-y-auto p-10 md:px-gutter max-w-container-max mx-auto w-full`}
      >
        {/* <!-- Breadcrumbs --> */}
        <BackButton
          onBack={() => router.replace("/clients")}
          label="Back to Clients"
        />

        {/* <!-- 1. Client Information Header (Bento/Card Style) --> */}
        {clientLoading ? (
          <ClientHeaderSkeleton />
        ) : (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg md:p-xl mb-xl shadow-sm relative overflow-hidden">
            {/* Subtle decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              {/* Left: Identity */}
              <div className="flex items-start gap-6">
                <ClientInitialBadge
                  name={client?.name || "John Doe"}
                  size="large"
                />
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
                        href={`mailto:${clientData?.email || "jane@acme.corp"}`}
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
                        href={`tel:${clientData?.phone || "+15551234567"}`}
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
                  <SecondaryButton
                    onClick={() => setEditOpen(true)}
                    label="Edit Client"
                    icon="edit"
                  />
                  <PrimaryButton
                    onClick={() =>
                      openModal("addProject", {
                        prefillClient: {
                          name: client?.name.toString() || "",
                          id: client?._id.toString() || "",
                        },
                      })
                    }
                    label=" New Project "
                    icon="add"
                    fontSize="medium"
                  />
                </div>
                <div className="flex gap-6 mt-2">
                  <div className="text-left md:text-right">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Lifetime Value
                    </p>
                    <p className="font-display text-headline-md font-bold text-on-surface">
                      {client?.totalBilled?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  </div>
                  <div className="w-px bg-outline-variant h-full hidden md:block"></div>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* 2. Project History Section */}
        <section className="mb-xl flex flex-col gap-2 ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-headline-sm font-semibold text-on-surface">
              Project History
            </h3>
          </div>
          {projectLoading ? (
            <ProjectTableSkeleton />
          ) : projects?.length > 0 ? (
            <>
              <div className="bg-surface-container-lowest flex flex-col gap-2 rounded-2xl border overflow-hidden border-outline-variant shadow-sm ">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        <th className="py-3 w-2/4 px-6  font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Project Name
                        </th>
                        <th className="py-3 w-0.66/4 px-6  font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Status
                        </th>
                        <th className="py-3 w-0.66/4 px-6  font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Start Date
                        </th>
                        <th className="py-3 w-0.66/4 px-6  font-label-sm  text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold ">
                          Value
                        </th>
                        <th className="px-4 "></th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface">
                      {projects?.map((project : Project) => (
                        <tr
                          onClick={() =>
                            router.replace(
                              `/projects/${project._id.toString()}`
                            )
                          }
                          key={project._id.toString()}
                          className="cursor-pointer border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group"
                        >
                          <td className="py-4 px-6 w-2/4">
                            <div className="font-label-md  text-label-md text-on-surface group-hover:text-primary transition-colors">
                              {project.title}
                            </div>
                            <div className="text-on-surface-variant  mt-0.5">
                              {project.description}
                            </div>
                          </td>
                          <td className="py-4 px-6 w-0.66/4 ">
                            <StatusBadge
                              color={
                                project.status === "completed"
                                  ? "success"
                                  : project.status === "in progress"
                                    ? "error"
                                    : "normal"
                              }
                              label={project.status}
                              fontSize="small"
                            />
                          </td>
                          <td className="py-4 w-0.66/4 px-6    text-on-surface-variant">
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="py-4 w-0.66/4 px-6  font-label-md text-label-md">
                            {project?.budget?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </td>
                          <td className="px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setProjectToBeDeleted(project._id.toString());
                                setShowProjectDeleteConfirmation(true);
                              }}
                              disabled={isDeletingProject}
                            >
                              <span


                                className="hover:text-primary material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <Pagination
                  total={projectTotal}
                  offset={projectOffset}
                  limit={limit}
                  onPageChange={(newOffset) => setProjectOffset(newOffset)}
                />
              </div>
            </>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-lg text-on-surface-variant">
              No projects yet.
            </div>
          )}
        </section>
        {/* <!-- 3. Invoices Section --> */}
        <section className=" flex flex-col gap-2 ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-headline-sm font-semibold text-on-surface">
              Recent Invoices
            </h3>
          </div>
          {invoiceLoading ? (
            <InvoiceTableSkeleton />
          ) : invoices?.length > 0 ? (
            <>
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Invoice #
                        </th>
                        <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Due Date
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
                      {!invoiceLoading &&
                        !invoiceError &&
                        invoiceData.invoices.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-6 px-6 text-on-surface-variant"
                            >
                              No invoices yet.
                            </td>
                          </tr>
                        )}
                      {invoiceData.invoices.map((invoice: Invoice) => (
                        <tr
                          onClick={() =>
                            router.push(`/invoices/${invoice._id}`)
                          }
                          key={invoice?._id.toString()}
                          className="cursor-pointer border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group"
                        >
                          <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="py-4 px-6 text-on-surface-variant">
                            {new Date(invoice.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="py-4 flex  px-6">
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
                          <td className="py-4 px-6 text-right font-label-md text-label-md text-on-surface">
                            {invoice.amount?.toLocaleString("en-US", {
                              style: "currency",
                              currency: session?.data?.user?.currency || "USD",
                            })}
                          </td>
                          <td className="py-4 px-6 text-right flex gap-md">
                           
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInvoiceToBeDeleted(invoice._id.toString());
                                setShowInvoiceDeleteConfirmation(true);
                              }}
                              disabled={isDeletingInvoice}
                            >
                              <span

                                className="hover:text-primary material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <Pagination
                  total={invoiceTotal}
                  offset={invoiceOffset}
                  limit={limit}
                  onPageChange={(newOffset) => setInvoiceOffset(newOffset)}
                />
              </div>
            </>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-lg text-on-surface-variant">
              No invoices yet.
            </div>
          )}
        </section>
      </div>
      {showProjectDeleteConfirmation && projectToBeDeleted && (
        <ConfirmationBox
          message="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowProjectDeleteConfirmation(false);
            setProjectToBeDeleted(null);
          }}
        />
      )}
      {showInvoiceDeleteConfirmation && invoiceToBeDeleted && (
        <ConfirmationBox
          message="Are you sure you want to delete this invoice? This action cannot be undone."
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowInvoiceDeleteConfirmation(false);
            setInvoiceToBeDeleted(null);
          }}
        />
      )}
    </div>
  );
};

export default Page;
