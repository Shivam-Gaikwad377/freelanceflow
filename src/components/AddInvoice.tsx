"use client";
import React, { useEffect } from "react";
import { useUiStore } from "@/store/useUiStore";

import { Form, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createInvoiceSchema } from "@/schemas/createInvoice.schema";
import { useSession } from "next-auth/react";

const AddInvoice = () => {
  const { activeModal, modalContext, closeModal } = useUiStore();
  const isOpen = activeModal === "addInvoice";
  const prefillProject = modalContext.prefillProject;
  const prefillClient = modalContext.prefillClient;
  const [clients, setClients] = useState<{ _id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ _id: string; name: string }[]>([]);
  const session = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
        lineItems: [
          {
            description: "",
            quantity: 1,
            price: 0,
            },
        ],
        status: "pending",
        project: "",
        projectId: "",
        client: "",
        clientId: "",
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
    return (
    <main className="flex-1 overflow-y-auto pt-24 pb-xxl px-lg flex justify-center">
      <div className="w-full max-w-170">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface m-0">
              New invoice
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Draft · not sent
            </p>
          </div>
          <div className="flex gap-2">
            <button className="custom-btn btn-secondary">Save draft</button>
            <button className="custom-btn btn-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                send
              </span>
              Save and send
            </button>
          </div>
        </div>

        <div className="card-container shadow-[0_4px_16px_rgba(73,75,214,0.03)] hover:shadow-[0_8px_24px_rgba(73,75,214,0.06)] transition-shadow duration-300">
          <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
            Invoice details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">Client</label>
              <select className="custom-input w-full appearance-none">
                <option value="">Select client</option>
                <option selected={true} value="acme">
                  Acme Studio
                </option>
              </select>
            </div>
            <div>
              <label className="label-text">Project</label>
              <select className="custom-input w-full appearance-none">
                <option value="">Select project (optional)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Invoice number</label>
              <input
                className="custom-input w-full"
                type="text"
                value="INV-0042"
              />
            </div>
            <div>
              <label className="label-text">Issue date</label>
              <input
                className="custom-input w-full"
                type="date"
                value="2023-10-24"
              />
            </div>
            <div>
              <label className="label-text">Due date</label>
              <input
                className="custom-input w-full"
                type="date"
                value="2023-11-23"
              />
            </div>
          </div>
        </div>

        <div className="card-container shadow-[0_4px_16px_rgba(73,75,214,0.03)] hover:shadow-[0_8px_24px_rgba(73,75,214,0.06)] transition-shadow duration-300">
          <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
            Line items
          </h2>

          <div className="hidden sm:grid grid-cols-[1fr_60px_90px_90px_32px] gap-2 px-1 pb-2 border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant">
            <div>Description</div>
            <div>Qty</div>
            <div>Rate</div>
            <div className="text-right">Amount</div>
            <div></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_60px_90px_90px_32px] gap-2 items-center py-3 border-b border-outline-variant/50">
            <input
              className="custom-input w-full"
              placeholder="Description"
              type="text"
              value="Homepage redesign"
            />
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">
                Qty
              </span>
              <input
                className="custom-input w-full"
                min="1"
                type="number"
                value="10"
              />
            </div>
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">
                Rate
              </span>
              <input
                className="custom-input w-full"
                min="0"
                type="number"
                value="1500"
              />
            </div>
            <div className="flex sm:block justify-between items-center text-right">
              <span className="sm:hidden text-label-sm text-on-surface-variant">
                Amount
              </span>
              <span className="font-body-md text-body-md text-on-surface">
                15,000.00
              </span>
            </div>
            <div className="text-right sm:text-center">
              <button
                aria-label="Remove item"
                className="text-on-surface-variant hover:text-error hover:bg-error-container p-1 rounded transition-colors"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                >
                  delete
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_60px_90px_90px_32px] gap-2 items-center py-3 border-b border-outline-variant">
            <input
              className="custom-input w-full"
              placeholder="Description"
              type="text"
              value="API integration"
            />
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">
                Qty
              </span>
              <input
                className="custom-input w-full"
                min="1"
                type="number"
                value="1"
              />
            </div>
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">
                Rate
              </span>
              <input
                className="custom-input w-full"
                min="0"
                type="number"
                value="8000"
              />
            </div>
            <div className="flex sm:block justify-between items-center text-right">
              <span className="sm:hidden text-label-sm text-on-surface-variant">
                Amount
              </span>
              <span className="font-body-md text-body-md text-on-surface">
                8,000.00
              </span>
            </div>
            <div className="text-right sm:text-center">
              <button
                aria-label="Remove item"
                className="text-on-surface-variant hover:text-error hover:bg-error-container p-1 rounded transition-colors"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                >
                  delete
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button className="custom-btn btn-text px-0">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                add
              </span>
              Add line item
            </button>
          </div>

          <div className="mt-6 pt-4 flex flex-col items-end gap-2">
            <div className="flex justify-between w-full max-w-60 font-body-sm text-body-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>23,000.00</span>
            </div>
            <div className="flex justify-between w-full max-w-60 font-body-sm text-body-sm text-on-surface-variant">
              <span>Tax (18%)</span>
              <span>4,140.00</span>
            </div>
            <div className="flex justify-between w-full max-w-60 font-headline-sm text-headline-sm text-on-surface mt-2">
              <span>Total</span>
              <span>27,140.00</span>
            </div>
          </div>
        </div>
        {/* Notes Card */}

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="custom-btn btn-secondary">Cancel</button>
          <button className="custom-btn btn-primary px-8">Save invoice</button>
        </div>
      </div>
    </main>
  );
};

export default AddInvoice;
