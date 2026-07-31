"use client";
import React, { useEffect, useState } from "react";
import { useUiStore } from "@/store/useUiStore";
import { Form, useFieldArray, useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { createInvoiceSchema, CreateInvoiceInput, CreateInvoiceOutput } from "@/schemas/createInvoice.schema";
import BackButton from "../BackButton";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

const AddInvoice = () => {
  const { activeModal, modalContext, closeModal } = useUiStore();
  const isOpen = activeModal === "addInvoice";
  const prefillProject = modalContext?.prefillProject;
  const prefillClient = modalContext?.prefillClient;

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [clients, setClients] = useState<{ _id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ _id: string; title: string }[]>([]);
  const [addinglineIndex, setAddingLineIndex] = useState<number | null>(null);

  const session = useSession();
  const router = useRouter();

  const form = useForm<CreateInvoiceInput, unknown, CreateInvoiceOutput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      lineItems: [],
      status: "pending",
      project: "",
      projectId: "",
      client: "",
      clientId: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      taxRate: 0.18,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Track the currently selected client ID to fetch respective projects
  const watchedClientId = watch("clientId");
  const watchedLineItems = watch("lineItems");

  // Totals calculations
  const subtotal = watchedLineItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  // 1. Fetch initial Clients list
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
    fetchClients();
  }, [session?.data?.user?._id]);

  // 2. Fetch Projects dynamically based on the selected Client
  useEffect(() => {
    const fetchClientProjects = async () => {
      if (watchedClientId) {
        try {
          const response = await axios.get(
            `/api/projects?clientId=${watchedClientId}`
          );
          setProjects(response.data.data.projects);
        } catch (error) {
          console.error("Error fetching client projects:", error);
        }
      }
      else if (prefillClient) {
        try {
          const response = await axios.get(
            `/api/projects?clientId=${prefillClient.id}`
          );
          setProjects(response.data.data.projects);
        } catch (error) {
          console.error("Error fetching prefill client projects:", error);
        }

        // Reset projects if no client is selected
      }
      else {
        setProjects([]);
      }
    };
    fetchClientProjects();
  }, [watchedClientId]);

  // 3. Reset & Prefill Logic when Modal Opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending",
        lineItems: [],
        client: prefillProject?.client || "",
        clientId: prefillProject?.clientId || "",
        project: prefillProject?.name || "",
        projectId: prefillProject?.id || "",
        taxRate: 0.18,
      });
      setAddingLineIndex(null);
      setCurrentStep(1);
    }
  }, [isOpen, prefillClient, prefillProject, form]);

  useEffect(() => {
    if (prefillClient || prefillProject) {
      setValue("client", prefillClient?.name || prefillProject?.client || "");
      setValue("clientId", prefillClient?.id || prefillProject?.clientId || "");
      setValue("project", prefillProject?.name || "");
      setValue("projectId", prefillProject?.id || "");
    }
  }, [prefillClient, prefillProject, setValue]);

  // Wizard Navigation Methods
  const handleNextStep = async () => {
    let isStepValid = false;

    if (currentStep === 1) {
      // Validate Client Selection
      isStepValid = await trigger(["clientId", "client"]);
    } else if (currentStep === 2) {
      // Validate Project & Dates Selection
      isStepValid = await trigger(["projectId", "project", "issueDate", "dueDate"]);
    }

    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CreateInvoiceOutput) => {
    try {
      if (data.lineItems.length === 0) {
        toast.error("Please add at least one line item.");
        return;
      }

      const response = await axios.post("/api/Invoices", data);
      if (response.data.success) {
        toast.success("Invoice added successfully!", { position: "top-right" });
        closeModal();
        router.replace("/projects");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "An unexpected error occurred";
      form.setError("root", { type: "server", message });
      toast.error(message);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="py-10 w-full overflow-y-auto flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-lg w-full max-w-4xl px-4"
      >
        <div className="mx-auto">
          {prefillProject ? (
            <BackButton onBack={() => closeModal()} label="Back to Project" />
          ) : (
            <BackButton onBack={() => closeModal()} label="Back to invoices" />
          )}

          <div className="flex justify-between items-start mb-6 mt-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg md:text-headline-lg-mobile text-on-surface">
                New invoice
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* 3-Step Progress Indicator */}
            <div className="flex gap-2 items-center mt-2">
              <div className={`h-2 w-10 rounded-full transition-colors ${currentStep >= 1 ? 'bg-primary' : 'bg-surface-variant'}`} />
              <div className={`h-2 w-10 rounded-full transition-colors ${currentStep >= 2 ? 'bg-primary' : 'bg-surface-variant'}`} />
              <div className={`h-2 w-10 rounded-full transition-colors ${currentStep >= 3 ? 'bg-primary' : 'bg-surface-variant'}`} />
            </div>
          </div>

          {/* ================= STEP 1: CLIENT SELECTION ================= */}
          {currentStep === 1 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)]">
              <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
                Select Client
              </h2>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                  Client
                </label>
                <select
                  value={watchedClientId}
                  onChange={(e) => {
                    const selected = clients.find((c) => c._id === e.target.value);
                    form.setValue("clientId", e.target.value, { shouldValidate: true });
                    form.setValue("client", selected?.name || "", { shouldValidate: true });

                    // Reset project state if the client changes so we don't carry over a mismatched project
                    form.setValue("projectId", "");
                    form.setValue("project", "");
                  }}
                  className={`form-input-select ${errors.clientId ? 'border-error' : ''}`}
                >
                  <option disabled value="">Select a client...</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {errors.clientId && <p className="text-error text-sm mt-1">{errors.clientId.message}</p>}
              </div>
            </div>
          )}

          {/* ================= STEP 2: PROJECT & DATES ================= */}
          {currentStep === 2 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)]">
              <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
                Project & Scheduling
              </h2>

              <div className="mb-6">
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                  Project
                </label>
                <select
                  value={watch("projectId")}
                  onChange={(e) => {
                    const selected = projects.find((p) => p._id === e.target.value);
                    setValue("projectId", e.target.value, { shouldValidate: true });
                    setValue("project", selected?.title || "", { shouldValidate: true });
                  }}
                  className={`form-input-select ${errors.projectId ? 'border-error' : ''}`}
                  disabled={projects.length === 0}
                >
                  <option disabled value="">
                    {projects.length === 0 ? "No projects found for this client" : "Select a project..."}
                  </option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
                {errors.projectId && <p className="text-error text-sm mt-1">{errors.projectId.message}</p>}
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block">
                    Tax Rate
                  </label>
                  <div className="flex">

                    <input
                      className="form-input-rate"
                      placeholder="0.00"
                      type="number"
                      {...register("taxRate", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                    Issue date
                  </label>
                  <input
                    className="form-input-text w-full"
                    type="date"
                    {...register("issueDate")}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block">
                    Deadline
                  </label>
                  <input
                    className="form-input-text"
                    type="date"
                    {...register("dueDate")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: LINE ITEMS ================= */}
          {currentStep === 3 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg shadow-[0_4px_16px_rgba(73,75,214,0.03)]">
              <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
                Line items
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant font-label-sm text-label-md text-on-surface-variant">
                      <th className="text-left py-2 px-1 font-medium">Description</th>
                      <th className="text-left py-2 px-1 font-medium w-20">Qty</th>
                      <th className="text-left py-2 px-1 font-medium w-24">Rate</th>
                      <th className="text-right py-2 px-1 font-medium w-28">Amount</th>
                      <th className="py-2 px-1 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      const description = watch(`lineItems.${index}.description`);
                      const quantity = watch(`lineItems.${index}.quantity`) || 0;
                      const price = watch(`lineItems.${index}.price`) || 0;
                      const amount = quantity * price;

                      return addinglineIndex === index ? (
                        <tr key={field.id} className="border-b border-outline-variant/50">
                          <td className="py-4 px-1">
                            <input 
                              {...register(`lineItems.${index}.description`, {
                                required: "Description is required",
                                minLength: { value: 5, message: "Must be at least 5 characters" },
                              })}
                              placeholder="Description"
                              type="text"
                              className={`form-input-text w-full ${errors.lineItems?.[index]?.description ? 'border-error' : ''}`}
                            />
                            {/* Add this to show the error */}
                            {errors.lineItems?.[index]?.description && (
                              <p className="text-error text-[10px] mt-1">{errors.lineItems[index].description.message}</p>
                            )}
                          </td>
                          <td className="py-4 px-1">
                            <input
                              {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                              min="1"
                              type="number"
                              className="form-input-text w-full"
                            />
                          </td>
                          <td className="py-4 px-1">
                            <input
                              {...register(`lineItems.${index}.price`, { valueAsNumber: true })}
                              min="0"
                              type="number"
                              className="form-input-text w-full"
                            />
                          </td>
                          <td className="py-4 px-1 text-right font-body-md text-body-md text-on-surface">
                            {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-1 text-center flex gap-1">
                            <button
                              type="button"
                              onClick={async () => {
                                const isValid = await trigger([
                                  `lineItems.${index}.description`,
                                  `lineItems.${index}.quantity`,
                                  `lineItems.${index}.price`,
                                ]);
                                if (isValid) setAddingLineIndex(null);
                              }}
                              className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                remove(index);
                                setAddingLineIndex(null);
                              }}
                              className="text-on-surface-variant hover:text-error p-1 rounded transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={field.id} className="border-b border-outline-variant/50">
                          <td className="py-2.5 px-1 text-body-sm text-on-surface">{description}</td>
                          <td className="py-2.5 px-1 text-body-sm text-on-surface-variant">{quantity}</td>
                          <td className="py-2.5 px-1 text-body-sm text-on-surface-variant">{price}</td>
                          <td className="py-2.5 px-1 text-right font-body-md text-body-md text-on-surface">
                            {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-1">
                            <div className="flex gap-1 justify-center">
                              <button
                                type="button"
                                onClick={() => setAddingLineIndex(index)}
                                className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-on-surface-variant hover:text-error p-1 rounded transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
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
                  type="button"
                  onClick={async () => {
                    const isValid = await trigger("lineItems");
                    if (!isValid && fields.length > 0) {
                      toast.error("Please complete the current line item correctly.");
                      return;
                    }
                    const newIndex = fields.length;
                    append({ description: "", quantity: 1, price: 0 });
                    setAddingLineIndex(newIndex);
                  }}
                  className="inline-flex items-center justify-center gap-sm py-sm text-primary font-label-md hover:bg-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add line item
                </button>
              </div>

              <div className="mt-6 pt-4 flex flex-col items-end gap-2">
                <div className="flex justify-between w-full max-w-60 font-body-sm text-body-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-60 font-body-sm text-body-sm text-on-surface-variant">
                  <span>Tax (18%)</span>
                  <span>{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-60 font-headline-sm text-headline-sm text-on-surface mt-2">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= WIZARD FOOTER ACTIONS ================= */}
          <div className="flex justify-between mt-8">
            {currentStep === 1 && (
              <>
                <button type="button" onClick={() => closeModal()} className="cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-surface border border-outline-variant text-on-surface-variant hover:text-primary  text-label-md py-3  rounded-lg  transition-colors shadow-sm" >Close</button>

                <button

                  onClick={handleNextStep}
                  type="button"
                  className="cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-primary text-on-primary py-3 rounded-lg font-label-md hover:bg-surface-tint  shadow-[0_4px_12px_rgba(70,72,212,0.2)]"
                >Next: Project & Dates</button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <button type="button" onClick={handlePrevStep} className="cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-surface border border-outline-variant text-on-surface-variant hover:text-primary  text-label-md py-3  rounded-lg  transition-colors shadow-sm" >Back</button>


                <button

                  onClick={handleNextStep}
                  type="button"
                  className="cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-primary text-on-primary py-3 rounded-lg font-label-md hover:bg-surface-tint  shadow-[0_4px_12px_rgba(70,72,212,0.2)]"
                >Next: Line Items</button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <button type="button" onClick={handlePrevStep} className="cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-surface border border-outline-variant text-on-surface-variant hover:text-primary  text-label-md py-3  rounded-lg  transition-colors shadow-sm" >Back</button>
                <button

                  type="submit"
                  disabled={isSubmitting || fields.length === 0}
                  className={`cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-primary text-on-primary py-3 rounded-lg font-label-md hover:bg-surface-tint  shadow-[0_4px_12px_rgba(70,72,212,0.2)] ${isSubmitting || fields.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  Save invoice
                </button>
              </>
            )}
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddInvoice;