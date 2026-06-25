
"use client"
import React, { use } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

import Link from "next/link";

const page = () => {
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const invoiceId = pathname.split("/").pop();
    const [client, setClient] = useState<any>(null);
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            
                try {
                    const response = await axios.get(`/api/Invoices/${invoiceId}`);
                    setInvoice(response.data.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching invoice:", error);
                    setLoading(false);
                }
            
        };

        fetchInvoice();
    }, [invoiceId]);
    useEffect(() => {
        const fetchClient = async () => {
            if (session && invoice) {
                try {
                    const response = await axios.get(`/api/Clients/${invoice?.clientId}`);
                    setClient(response.data.data);
                } catch (error) {
                    console.error("Error fetching client:", error);
                }
            }
        };

        fetchClient();
    }, [invoice?.clientId]);

    useEffect(() => {
        const fetchProject = async () => {
            if (session && invoice) {
                try {
                    const response = await axios.get(`/api/projects/${invoice?.projectId}`);
                    setProject(response.data.data);
                } catch (error) {
                    console.error("Error fetching project:", error);
                }
            }
        };

        fetchProject();
    }, [invoice?.projectId]);
  return (
    <div className="flex-1 p-xl  mx-auto w-full">
      
      <div className="py-md">
      
        <div className="flex items-center justify-between mb-lg">
          <a
            className="inline-flex items-center text-primary font-label-md hover:underline gap-xs transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Invoices
          </a>
          <div className="flex gap-sm">
            <button className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface">
              <span className="material-symbols-outlined text-[15px]">edit</span>
              Edit
            </button>
            <button className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface">
              <span className="material-symbols-outlined text-[15px]">
                download
              </span>
              Download
            </button>
            <button
              className="flex items-center gap-1.25 text-[13px] text-on-primary bg-primary hover:opacity-90 transition-opacity px-md py-xs rounded-lg"
              id="action-btn"
            >
              <span
                className="material-symbols-outlined text-[15px]"
                id="action-icon"
              >
                check
              </span>
              <span id="action-label">Mark as paid</span>
            </button>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg mb-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-on-surface-variant m-0 mb-1.25 tracking-[0.07em] uppercase font-semibold">
                Invoice
              </p>
              <p className="text-[22px] font-medium font-mono m-0 tracking-[-0.02em] text-on-surface">
                #INV-{invoice?.invoiceNumber}
              </p>
            </div>
            <span
              className="text-[13px] px-3.5 py-1.25 rounded-lg font-medium"
              id="status-badge"
            ></span>
          </div>
          <div className="border-t border-outline-variant/30 mt-md pt-md grid grid-cols-3 gap-md">
            <div>
              <p className="text-[12px] text-on-surface-variant m-0 mb-[4px]">
                Issue date
              </p>
              <p className="text-[14px] font-medium m-0 text-on-surface">
                {new Date(invoice?.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-on-surface-variant m-0 mb-[4px]">
                Due date
              </p>
              <p className="text-[14px] font-medium m-0 text-on-surface">
                {project?.deadline ? new Date(project.deadline).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-on-surface-variant m-0 mb-[4px]">
                Total amount
              </p>
              <p className="text-[14px] font-medium m-0 text-on-surface">₹{invoice?.amount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mb-md">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
            <p className="text-[11px] text-on-surface-variant tracking-[0.07em] m-0 mb-sm uppercase font-semibold">
              Bill to
            </p>
            <div className="flex items-center gap-2.5 mb-sm">
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[13px] font-medium shrink-0">
                {client?.name?.charAt(0)}
              </div>
              <div className="flex gap-1">
                <p className="text-[14px] font-medium m-0 mb-0.75 text-on-surface">
                  {client?.name}
                </p>
                <span className="text-[11px] bg-secondary-container text-on-secondary-container px-[8px] py-0.5 rounded-lg">
                  Active
                </span>
              </div>
            </div>
            <div className="border-t border-outline-variant/30 pt-2.5 flex flex-col gap-1.75">
              <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                <span className="material-symbols-outlined text-[15px]">mail</span>
                {client?.email}
              </p>
              <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                <span className="material-symbols-outlined text-[15px]">phone</span>
                {client?.phone}
              </p>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
            <p className="text-[11px] text-on-surface-variant tracking-[0.07em] m-0 mb-sm uppercase font-semibold">
              Project
            </p>
            <div className="flex items-center gap-2.5 mb-sm">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  folder
                </span>
              </div>
              <p className="text-[14px] font-medium m-0 text-on-surface">
                {project?.title}
              </p>
            </div>
            <div className="border-t border-outline-variant/30 pt-2.5 flex flex-col gap-1.75">
              <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                <span className="material-symbols-outlined text-[15px]">
                  clock_loader_40
                </span>
                {project?.status}
              </p>
              <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                <span className="material-symbols-outlined text-[15px]">
                  calendar_month
                </span>
                Deadline: {project?.deadline ? new Date(project.deadline).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Not set"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
          <p className="text-[11px] text-on-surface-variant tracking-[0.07em] m-0 mb-sm uppercase font-semibold">
            Line items
          </p>
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="text-left py-sm text-[12px] text-on-surface-variant font-medium w-1/2">
                  Description
                </th>
                <th className="text-right py-sm text-[12px] text-on-surface-variant font-medium w-[13%]">
                  Qty
                </th>
                <th className="text-right py-sm text-[12px] text-on-surface-variant font-medium w-[22%]">
                  Rate
                </th>
                <th className="text-right py-sm text-[12px] text-on-surface-variant font-medium w-[15%]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
                {invoice?.lineItems?.map((item: any, index: number) => (
                    <tr key={index}>
                <td className="py-2.75 text-[14px] text-on-surface">
                    {item.description}
                </td>
                <td className="py-2.75 text-right text-[13px] text-on-surface-variant">
                  {item.quantity}
                </td>
                <td className="py-2.75 text-right text-[13px] text-on-surface-variant">
                  {item.rate}
                </td>
                <td className="py-2.75 text-right text-[14px] font-medium text-on-surface">
                  {item.rate * item.quantity}
                </td>
              </tr>))}
            </tbody>
          </table>
          <div className="border-t border-outline-variant/30 mt-sm pt-3.5 flex justify-end">
            <div className="min-w-52.5">
              <div className="flex justify-between mb-2.5">
                <span className="text-[13px] text-on-surface-variant">
                  Subtotal
                </span>
                <span className="text-[13px] text-on-surface">₹24,500</span>
              </div>
              <div className="border-t border-outline-variant/30 pt-2.5 flex justify-between">
                <span className="text-[15px] font-medium text-on-surface">
                  Total
                </span>
                <span className="text-[15px] font-medium text-on-surface">
                  ₹24,500
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
