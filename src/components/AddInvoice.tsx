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
  useEffect(() => {
    const fetchClients = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get("/api/clients");
          setClients(response.data);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      }
    };
    const fetchProjects = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get("/api/projects");
          setProjects(response.data);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    fetchClients();
    fetchProjects();
  }, []);
  useEffect(() => {
    if (isOpen) {
      form.reset({
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "pending",
        lineItems: [
          {
            description: "",
            quantity: 1,
            price: 0,
          },
        ],
        
        client: prefillClient?.name || "",
        clientId: prefillClient?.id || "",
        project: prefillProject?.name || "",
        projectId: prefillProject?.id || "",
      });
    }
  }, [isOpen, prefillClient, prefillProject]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;
   const onSubmit = async (data: z.infer<typeof createInvoiceSchema>) => {
      try {
        const response = await axios.post("/api/invoices", data);
  
        // Only 2xx reaches here
        if (response.data.success) {
          toast.success("Invoice added successfully!", {
            position: "top-right",
          });
          closeModal();
          router.replace("/projects");
        }
      } catch (err: any) {
        const status = err.response?.status;
        const message = err.response?.data?.message;
  
        form.setError("root", {
          type: "server",
          message: message || "An unexpected error occurred",
        });
      }
    };
     useEffect(() => {
        if (prefillClient || prefillProject) {
          form.setValue("client", prefillClient?.name || "");
          form.setValue("clientId", prefillClient?.id || "");
          form.setValue("project", prefillProject?.name || "");
          form.setValue("projectId", prefillProject?.id || "");
        }
      }, [prefillClient, prefillProject, form]);
    
      if (!isOpen) return null;
      console.log("prefillClient:");
  return (
    <main className="py-10  overflow-y-auto flex justify-center">
      <div className="max-w-4xl mx-auto">
      
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg md:text-headline-lg-mobile text-on-surface">New invoice</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Draft · not sent</p>
          </div>
          <div className="flex gap-2">
            <button
              className="cursor-pointer px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-all flex items-center gap-2">Save
              draft</button>
            <button
              className="cursor-pointer px-md py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md transition-all flex items-center gap-2 shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">send</span>
              Save and send
            </button>
          </div>
        </div>

        <div
          className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)] hover:shadow-[0_8px_24px_rgba(73,75,214,0.06)] transition-shadow duration-300">
          <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">Invoice details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block">Client</label>
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all appearance-none">
                <option value="">Select client</option>
                <option selected={true} value="acme">Acme Studio</option>
              </select>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block">Project</label>
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all appearance-none">
                <option value="">Select project (optional)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block">Invoice number</label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                type="text" value="INV-0042" />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block">Issue date</label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                type="date" value="2023-10-24" />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block">Due date</label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                type="date" value="2023-11-23" />
            </div>
          </div>
        </div>
 
        <div
          className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)] hover:shadow-[0_8px_24px_rgba(73,75,214,0.06)] transition-shadow duration-300">
          <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">Line items</h2>
    
          <div
            className="hidden sm:grid grid-cols-[1fr_60px_90px_90px_32px] gap-2 px-1 pb-2 border-b border-outline-variant font-label-sm text-label-md text-on-surface-variant">
            <div>Description</div>
            <div>Qty</div>
            <div>Rate</div>
            <div className="text-right">Amount</div>
            <div></div>
          </div>
   
          <div
            className="grid grid-cols-1 sm:grid-cols-[1fr_60px_90px_90px_32px] gap-2 items-center py-3 border-b border-outline-variant/50">
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
              placeholder="Description" type="text" value="Homepage redesign" />
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">Qty</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                min="1" type="number" value="10" />
            </div>
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">Rate</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                min="0" type="number" value="1500" />
            </div>
            <div className="flex sm:block justify-between items-center text-right">
              <span className="sm:hidden text-label-sm text-on-surface-variant">Amount</span>
              <span className="font-body-md text-body-md text-on-surface">15,000.00</span>
            </div>
            <div className="text-right sm:text-center">
              <button aria-label="Remove item"
                className="text-on-surface-variant hover:text-error hover:bg-error-container p-1 rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
      
          <div
            className="grid grid-cols-1 sm:grid-cols-[1fr_60px_90px_90px_32px] gap-2 items-center py-3 border-b border-outline-variant/50">
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
              placeholder="Description" type="text" value="API integration" />
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">Qty</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                min="1" type="number" value="1" />
            </div>
            <div className="flex sm:block gap-2 items-center">
              <span className="sm:hidden text-label-sm text-on-surface-variant w-12">Rate</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                min="0" type="number" value="8000" />
            </div>
            <div className="flex sm:block justify-between items-center text-right">
              <span className="sm:hidden text-label-sm text-on-surface-variant">Amount</span>
              <span className="font-body-md text-body-md text-on-surface">8,000.00</span>
            </div>
            <div className="text-right sm:text-center">
              <button aria-label="Remove item"
                className="text-on-surface-variant hover:text-error hover:bg-error-container p-1 rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
       
          <div className="mt-4">
            <button
              className="inline-flex items-center justify-center gap-sm py-sm text-primary font-label-md hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add line item
            </button>
          </div>
    
          <div className="mt-6 pt-4 flex flex-col items-end gap-2">
            <div className="flex justify-between w-full max-w-[240px] font-body-sm text-body-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>23,000.00</span>
            </div>
            <div className="flex justify-between w-full max-w-[240px] font-body-sm text-body-sm text-on-surface-variant">
              <span>Tax (18%)</span>
              <span>4,140.00</span>
            </div>
            <div
              className="flex justify-between w-full max-w-[240px] font-headline-sm text-headline-sm text-on-surface mt-2">
              <span>Total</span>
              <span>27,140.00</span>
            </div>
          </div>
        </div>
    
      
     
        <div className="flex justify-end gap-3 mt-8">
          <button
            className="cursor-pointer px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-all flex items-center gap-2">Cancel</button>
          <button
            className="cursor-pointer px-md py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md transition-all flex items-center gap-2 shadow-sm shadow-primary/20">Save
            invoice</button>
        </div>
      </div>
    </main>
  );
};

export default AddInvoice;
