"use client";
import React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useUiStore } from "@/store/useUiStore";
import Link from "next/link";
import EditClientDrawer from "@/components/Client/EditClient";
import { toast } from "sonner";
import useFetch from "@/app/hooks/useFetch";
import BackButton from "@/components/BackButton";
import { IClient } from "@/schemas/createClient.schema";
import { IInvoice } from "@/schemas/createInvoice.schema";
import { IProject } from "@/schemas/project.schema";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import StatusBadge from "@/components/Invoice/StatusBadge";
import ClientInitialBadge from "@/components/Client/ClientInitialBadge";

const Page = () => {
  const { openModal } = useUiStore();
  const session = useSession();
  const [client, setClient] = useState<IClient | null>(null);
  const pathname = usePathname();

  const id = pathname.split("/").pop();
  const [invoiceOffset, setInvoiceOffset] = useState<number>(0);
  const [projectOffset, setProjectOffset] = useState<number>(0);
  const [editOpen, setEditOpen] = useState(false);
  const limit = 5;
  const [invoiceTotal, setInvoiceTotal] = useState<number>(0);
  const [projectTotal, setProjectTotal] = useState<number>(0);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const {
    data: clientData,
    loading: clientLoading,
    error: clientError,
  } = useFetch(`/api/Clients/${id}`);

  const [projects, setProjects] = useState<IProject[]>([]);
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

  useEffect(() => {
    if (clientData || invoiceData || projectData) {
      if (clientData) {
        setClient(clientData);
      }
      if (invoiceData) {
        setInvoices(invoiceData?.invoices || []);
        setInvoiceTotal(invoiceData?.total || 0);
      }
      if (projectData) {
        setProjects(projectData?.projects || []);
        setProjectTotal(projectData?.total || 0);
      }
    }
  }, [clientData, invoiceData, projectData]);
  useEffect(() => {
    setInvoiceOffset(0);
    setProjectOffset(0);
  }, [id]);

  const router = useRouter();

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
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg md:p-xl mb-xl shadow-sm relative overflow-hidden">
          {/* Subtle decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            {/* Left: Identity */}
            <div className="flex items-start gap-6">
              <ClientInitialBadge name={client?.name || "John Doe"} size="large" />
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
                      currency: session?.data?.user?.currency || "USD",
                    })}
                  </p>
                </div>
                <div className="w-px bg-outline-variant h-full hidden md:block"></div>
              </div>
            </div>
          </div>
        </section>
        {/* 2. Project History Section */}
        <section className="mb-xl flex flex-col gap-2 ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-headline-sm font-semibold text-on-surface">
              Project History
            </h3>
          </div>
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
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm text-on-surface">
                  {projects.map((project) => (
                    <tr
                      onClick={() =>
                        router.replace(`/projects/${project._id.toString()}`)
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
                        <StatusBadge color={project.status === "completed" ? "success" : project.status === "in progress" ? "error" : "normal"} label={project.status} fontSize="small" />
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
                          currency: session?.data?.user?.currency || "USD",
                        })}
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
        </section>
        {/* <!-- 3. Invoices Section --> */}
        <section className=" flex flex-col gap-2 ">
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
                  {invoiceLoading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 px-6 text-on-surface-variant"
                      >
                        Loading invoices...
                      </td>
                    </tr>
                  )}
                  {invoiceError && (
                    <tr>
                      <td colSpan={5} className="py-6 px-6 text-error">
                        Couldn't load invoices.
                      </td>
                    </tr>
                  )}
                  {!invoiceLoading &&
                    !invoiceError &&
                    invoices.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 px-6 text-on-surface-variant"
                        >
                          No invoices yet.
                        </td>
                      </tr>
                    )}
                  {invoices.map((invoice: any) => (
                    <tr
                      onClick={() => router.push(`/invoices/${invoice._id}`)}
                      key={invoice?._id}
                      className="cursor-pointer border-b border-outline-variant/30 hover:bg-surface-container-highest/30 transition-colors group"
                    >
                      <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 flex  px-6">
                       <StatusBadge color={invoice.status === "Paid" ? "success" : invoice.status === "pending" ? "normal" : "error"} label={invoice.status} fontSize="small" />
                      </td>
                      <td className="py-4 px-6 text-right font-label-md text-label-md text-on-surface">
                        {invoice.amount?.toLocaleString("en-US", {
                          style: "currency",
                          currency: session?.data?.user?.currency || "USD",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined">
                            download
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
        </section>
      </div>
    </div>
  );
};

export default Page;
