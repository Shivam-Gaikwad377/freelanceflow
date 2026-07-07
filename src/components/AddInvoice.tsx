"use client";
import React, { useEffect } from "react";
import { useUiStore } from "@/store/useUiStore";

import { Form, useFieldArray, useForm } from "react-hook-form";
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
  const [projects, setProjects] = useState<{ _id: string; title: string }[]>(
    []
  );
  const session = useSession();
  const router = useRouter();
  const [addinglineIndex, setAddingLineIndex] = useState<number | null>(null);
  const [client, setClient] = useState<{ _id: string; name: string } | null>(
    null
  );
  const form = useForm<z.input<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      lineItems: [
        
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });
  useEffect(() => {
    const fetchClients = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get("/api/Clients");
          setClients(response.data.data.clients);
        } catch (error) {
          console.error("Error fetching Clients:", error);
        }
      }
    };
    const fetchProjects = async () => {
      if (session?.data?.user?._id) {
        try {
          const response = await axios.get("/api/projects");
          setProjects(response.data.data.projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    fetchClients();
    fetchProjects();
  }, [session?.data?.user?._id]);
  useEffect(() => {
    if (isOpen) {
      form.reset({
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "pending",
        lineItems: [
         
        ],

        client: prefillClient?.name || "",
        clientId: prefillClient?.id || "",
        project: prefillProject?.name || "",
        projectId: prefillProject?.id || "",

      });
      setAddingLineIndex(null);
    }
  }, [isOpen, prefillClient, prefillProject]);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = form;
  const watchedLineItems = watch("lineItems");

  const subtotal = watchedLineItems.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const onSubmit = async (data: z.input<typeof createInvoiceSchema>) => {
    try {
      console.log("Submitting invoice data:", data);
      const response = await axios.post("/api/Invoices", data);

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
      form.setValue("client", prefillClient?.name || prefillProject?.client || "");
      form.setValue("clientId", prefillClient?.id || prefillProject?.clientId || "");
      form.setValue("project", prefillProject?.name || "");
      form.setValue("projectId", prefillProject?.id || "");
    }
  }, [prefillClient, prefillProject, form]);
  useEffect(() => {
    if (prefillClient) {
      const selectedClient = clients.find((c) => c._id === prefillClient.id);
      setClient(selectedClient || null);
    }
    const fetchClientProject = async () => {
      if (client) {
        console.log("Fetching projects for client:", client._id);
        try {
          const response = await axios.get(
            `/api/projects?searchBy=clientId&search=${client._id}`
          );
          setProjects(response.data.data.projects);
        } catch (error) {
          console.error("Error fetching client projects:", error);
        }
      }
    };
    fetchClientProject();
  }, [client, prefillClient]);

  if (!isOpen) return null;

  return (
    <main className="py-10  overflow-y-auto flex justify-center">
      <Form
        control={form.control}
        onSubmit={({ data }) => onSubmit(data)}
        onError={(errors) => console.log("Validation failed:", errors)}
        className="space-y-lg"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="font-headline-lg text-headline-lg md:text-headline-lg-mobile text-on-surface">
                New invoice
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Draft · not sent
              </p>
            </div>
            <div className="flex gap-2">
              <button className="cursor-pointer px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-all flex items-center gap-2">
                Save draft
              </button>
              <button className="cursor-pointer px-md py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md transition-all flex items-center gap-2 shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
                Save and send
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)] hover:shadow-[0_8px_24px_rgba(73,75,214,0.06)] transition-shadow duration-300">
            <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
              Invoice details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Client
                </label>
                <select
                  value={form.watch("clientId")}
                  onChange={(e) => {
                    const selected = clients.find(
                      (c) => c._id === e.target.value
                    );
                    form.setValue("clientId", e.target.value, {
                      shouldValidate: true,
                    });
                    form.setValue("client", selected?.name || "", {
                      shouldValidate: true,
                    });
                    setClient(selected || null);
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all appearance-none"
                >
                  <option disabled value="">
                    Select a client...
                  </option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Project
                </label>
                <select
                  value={form.watch("projectId")}
                  onChange={(e) => {
                    const selected = projects.find(
                      (p) => p._id === e.target.value
                    );
                    form.setValue("projectId", e.target.value, {
                      shouldValidate: true,
                    });
                    form.setValue("project", selected?.title || "", {
                      shouldValidate: true,
                    });
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all appearance-none"
                >
                  <option disabled value="">
                    Select a project...
                  </option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project?.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Issue date
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                  type="date"
                  {...register("issueDate", { valueAsDate: true })}
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Due date
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                  type="date"
                  {...register("dueDate", { valueAsDate: true })}
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)] hover:shadow-[0_8px_24px_rgba(73,75,214,0.06)] transition-shadow duration-300">
            <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
              Line items
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant font-label-sm text-label-md text-on-surface-variant">
                    <th className="text-left py-2 px-1 font-medium">
                      Description
                    </th>
                    <th className="text-left py-2 px-1 font-medium w-20">
                      Qty
                    </th>
                    <th className="text-left py-2 px-1 font-medium w-24">
                      Rate
                    </th>
                    <th className="text-right py-2 px-1 font-medium w-28">
                      Amount
                    </th>
                    <th className="py-2 px-1 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => {
                    const description = form.watch(
                      `lineItems.${index}.description`
                    );
                    const quantity =
                      form.watch(`lineItems.${index}.quantity`) || 0;
                    const price = form.watch(`lineItems.${index}.price`) || 0;
                    const amount = quantity * price;

                    return addinglineIndex === index ? (
                      <tr
                        key={field.id}
                        className="border-b border-outline-variant/50"
                      >
                        <td className=" py-4 px-1 ">
                          <input
                            {...register(`lineItems.${index}.description`, {
                              required: "Description is required",
                              minLength: {
                                value: 5,
                                message:
                                  "Description must be at least 5 characters long",
                              },
                            })}
                            placeholder="Description"
                            type="text"
                            className="w-full  bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                          />
                        </td>
                        <td className="py-4 px-1">
                          <input
                            {...register(`lineItems.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            min="1"
                            type="number"
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                          />
                        </td>
                        <td className="py-4 px-1">
                          <input
                            {...register(`lineItems.${index}.price`, {
                              valueAsNumber: true,
                            })}
                            min="1"
                            type="number"
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                          />
                        </td>
                        <td className="py-4 px-1 text-right font-body-md text-body-md text-on-surface">
                          {amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4 px-1 text-center">
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => {
                              remove(index);
                              setAddingLineIndex(null);
                            }}
                            className="text-on-surface-variant hover:text-error hover:bg-error-container p-1 rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              // 1. Manually trigger validation for the current row's fields
                              const isValid = await trigger([
                                `lineItems.${index}.description`,
                                `lineItems.${index}.quantity`,
                                `lineItems.${index}.price`,
                              ]);

                              // 2. If valid, close the edit mode for this row
                              if (isValid) {
                                setAddingLineIndex(
                                  index === addinglineIndex ? null : index
                                );
                              }
                            }}
                            aria-label="Save item"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              save
                            </span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={field.id}
                        className="border-b border-outline-variant/50"
                      >
                        <td className="py-2.5 px-1 text-body-sm text-on-surface">
                          {description}
                        </td>
                        <td className="py-2.5 px-1 text-body-sm text-on-surface-variant">
                          {quantity}
                        </td>
                        <td className="py-2.5 px-1 text-body-sm text-on-surface-variant">
                          {price}
                        </td>
                        <td className="py-2.5 px-1 text-right font-body-md text-body-md text-on-surface">
                          {amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-2.5 px-1">
                          <div className="flex gap-1 justify-center">
                            <button
                              type="button"
                              onClick={() => setAddingLineIndex(index)}
                              aria-label="Edit item"
                              className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              aria-label="Remove item"
                              className="text-on-surface-variant hover:text-error hover:bg-error-container p-1 rounded transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <button
                onClick={async () => {
                  // 1. Validate all existing line items
                  const isValid = await trigger("lineItems");
                  if (!isValid) {
                    toast.error("please enter all fields.", {
                      position: "top-right",
                    });
                  }
                  // 2. Only add a new row if all current rows are valid
                  if (isValid || addinglineIndex === null) {
                    const newIndex = fields.length;
                    append({
                      description: "",
                      quantity: 1,
                      price: 0,
                    });
                    // 3. Put the newly added row into edit mode
                    setAddingLineIndex(newIndex);
                  }
                }}
                className="inline-flex items-center justify-center gap-sm py-sm text-primary font-label-md hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                Add line item
              </button>
            </div>

            <div className="mt-6 pt-4 flex flex-col items-end gap-2">
              <div className="flex justify-between w-full max-w-60 font-body-sm text-body-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span>
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-full max-w-60 font-body-sm text-body-sm text-on-surface-variant">
                <span>Tax (18%)</span>
                <span>
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-full max-w-60 font-headline-sm text-headline-sm text-on-surface mt-2">
                <span>Total</span>
                <span>
                  {total.toFixed(2)}
                 
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => {
                closeModal();
              }}
              className="cursor-pointer px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-all flex items-center gap-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-md py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md transition-all flex items-center gap-2 shadow-sm shadow-primary/20"
            >
              Save invoice
            </button>
          </div>
        </div>
      </Form>
    </main>
  );
};

export default AddInvoice;
