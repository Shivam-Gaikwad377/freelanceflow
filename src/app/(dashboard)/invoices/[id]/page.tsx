"use client";
import React, { use } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { updateInvoiceSchema } from "@/schemas/updateInvoice.schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const page = () => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const invoiceId = pathname.split("/").pop();
  const [client, setClient] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDueDate, setEditingDueDate] = useState<boolean>(false);
  const lineItemsForm = useForm<z.infer<typeof updateInvoiceSchema>>({
    resolver: zodResolver(updateInvoiceSchema) as any,
    defaultValues: {
      lineItems: invoice?.lineItems || [],
      dueDate: invoice?.dueDate || "",
      description: invoice?.description || "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = lineItemsForm;
  const { fields, append, remove } = useFieldArray({
    control: lineItemsForm.control,
    name: "lineItems",
  });

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
          const response = await axios.get(
            `/api/projects/${invoice?.projectId}`
          );
          setProject(response.data.data);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      }
    };

    fetchProject();
  }, [invoice?.projectId]);
  const handlePaid = async () => {
    try {
      const response = await axios.patch(`/api/Invoices/${invoiceId}`, {
        status: "Paid",
        paidAt: new Date(),
      });
      if(response.data.success) {
      setInvoice((prevInvoice: any) => ({
        ...prevInvoice,
        status: "Paid",
        paidAt: new Date(),
      }));
      toast.success("Invoice marked as paid");
      router.refresh();
    }
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Error updating invoice status");
    }
  };
  const handleLineItemsUpdate = async (
    data: z.infer<typeof updateInvoiceSchema>
  ) => {
    try {
      const response = await axios.patch(`/api/Invoices/${invoiceId}`, data);
      if (response.data.success) {
        setInvoice(response.data.data);

        setEditingIndex(null);
        toast.success("Invoice updated successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Error updating invoice");
    }
  };
  useEffect(() => {
    if (invoice) {
      reset({
        lineItems: invoice.lineItems,
        dueDate: invoice.dueDate || "",
        description: invoice.description || "",
      });
    }
  }, [invoice]);
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDueDate = e.target.value;
    try {
      const response = await axios.patch(`/api/Invoices/${invoiceId}`, {
        dueDate: newDueDate,
      });
      if (response.data.success) {
        setInvoice((prevInvoice: any) => ({
          ...prevInvoice,
          dueDate: newDueDate,
        }));
        toast.success("Due date updated successfully");
        setEditingDueDate(false);
      }
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Error updating due date");
    }
  };
  return (
    <div className="flex-1 px-xl mx-auto w-full">
      <div className="py-md">
        <div className="flex items-center justify-between mb-lg">
          <a
            className="inline-flex items-center text-primary font-label-md hover:underline gap-xs transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Invoices
          </a>
          <div className="flex items-center justify-center gap-sm">
            <button className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface">
              <span className="material-symbols-outlined text-[15px]">
                edit
              </span>
              Edit
            </button>
            <button className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface">
              <span className="material-symbols-outlined text-[15px]">
                download
              </span>
              Download
            </button>
            {invoice?.status !== "paid" ? (
              <button
                className="flex items-center gap-1.25 text-[13px] text-on-primary bg-primary hover:opacity-90 transition-opacity px-md py-xs rounded-lg"
                id="action-btn"
                onClick={handlePaid}
              >
                <span
                  className="material-symbols-outlined text-[15px]"
                  id="action-icon"
                >
                  check
                </span>
                <span id="action-label">Mark as paid</span>
              </button>
            ) : (
              <p className="text-label-lg text-on-surface-variant">Paid</p>
            )}
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg mb-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-md text-on-surface-variant m-0 mb-1.25 tracking-[0.07em] uppercase font-semibold">
                Invoice
              </p>
              <p className="text-[22px] font-medium font-mono m-0 tracking-[-0.02em] text-on-surface">
                #INV-{invoice?.invoiceNumber}
              </p>
            </div>
            <span
              className="text-label-md px-3.5 py-1.25 rounded-lg font-medium"
              id="status-badge"
            ></span>
          </div>
          <div className="border-t border-outline-variant/30 mt-md pt-md grid grid-cols-3 gap-md">
            <div>
              <p className="text-label-md text-on-surface-variant m-0 mb-[4px]">
                Issue date
              </p>
              <p className="text-label-md font-medium m-0 text-on-surface">
                {new Date(invoice?.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant m-0 mb-[4px]">
                Due date
              </p>
              {editingDueDate ? (
                <input
                  type="date"
                  defaultValue={invoice?.dueDate}
                  onChange={handleDateChange}
                  className="text-label-md font-medium m-0 text-on-surface"
                />
              ) : (
                <div className="cursor-pointer flex group items-center gap-1.25">
                  <p className="text-label-md font-medium m-0 text-on-surface">
                    {invoice?.dueDate
                      ? new Date(invoice?.dueDate).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not set"}
                  </p>
                  <span
                    onClick={() => setEditingDueDate(true)}
                    className="material-symbols-outlined opacity-0 duration-200 transition-opacity group-hover:opacity-100 text-label-sm"
                  >
                    edit
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant m-0 mb-[4px]">
                Total amount
              </p>
              <p className="text-label-md font-medium m-0 text-on-surface">
                ₹{invoice?.amount?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mb-md">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
            <p className="text-[11px] text-on-surface-variant tracking-[0.07em] m-0 mb-sm uppercase font-semibold">
              Bill to
            </p>
            <div className="flex items-center gap-2.5 mb-sm">
              <div className="aspect-square rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-md p-2 font-medium shrink-0">
                {client?.name.charAt(0).toUpperCase() +
                  client?.name.split(" ").slice(-1)[0].charAt(0).toUpperCase()}
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
                <span className="material-symbols-outlined text-[15px]">
                  mail
                </span>
                {client?.email}
              </p>
              <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                <span className="material-symbols-outlined text-[15px]">
                  phone
                </span>
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
                Deadline:{" "}
                {project?.deadline
                  ? new Date(project.deadline).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg">
          <div className="flex justify-between px-1">
            <p className="text-[11px] text-on-surface-variant tracking-[0.07em] m-0 mb-sm uppercase font-semibold">
              Line items
            </p>
            <button
            className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface"
              onClick={() => {
                const newIndex = fields.length; // capture before append
                append({ description: "", quantity: 1, price: 0 });
                setEditingIndex(newIndex); // opens the new blank row in edit mode
              }}
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              Add item
            </button>
          </div>
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="text-left  py-sm text-[12px] text-on-surface-variant font-medium w-[40%]">
                  Description
                </th>
                <th className="text-left py-sm text-[12px] text-on-surface-variant font-medium w-[10%]">
                  Qty
                </th>
                <th className="text-left py-sm text-[12px] text-on-surface-variant font-medium w-[15%]">
                  Rate
                </th>
                <th className="text-left py-sm text-[12px] text-on-surface-variant font-medium w-[15%]">
                  Total
                </th>
                <th className="text-left py-sm text-[12px] text-on-surface-variant font-medium w-[10%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field: any, index: number) =>
                editingIndex === index ? (
                  <tr key={index}>
                    <td className="p-2.75 text-right text-shadow-surface-bright text-[14px] w-[40%] text-on-surface">
                      <input
                        className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                        placeholder="e.g. Jonathan Smith"
                        required={true}
                        type="text"
                        defaultValue={field.description}
                        {...register(`lineItems.${index}.description`, {
                          required: "Description is required",
                          minLength: {
                            value: 5,
                            message:
                              "Description must be at least 5 characters long",
                          },
                        })}
                      />
                    </td>
                    <td className="p-2.75 text-right  text-[13px] w-[10%] text-on-surface-variant">
                      <input
                        className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                        placeholder="e.g. Jonathan Smith"
                        required={true}
                        type="text"
                        defaultValue={field.quantity}
                        {...register(`lineItems.${index}.quantity`, {
                          required: "Quantity is required",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Quantity must be at least 1",
                          },
                        })}
                      />
                    </td>
                    <td className="p-2.75 text-right  text-[13px] w-[15%] text-on-surface-variant">
                      <input
                        className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                        placeholder="e.g. Jonathan Smith"
                        required={true}
                        type="text"
                        defaultValue={field.price}
                        {...register(`lineItems.${index}.price`, {
                          required: "Price is required",
                          valueAsNumber: true,
                          min: {
                            value: 0,
                            message: "Price must be a positive number",
                          },
                        })}
                      />
                    </td>
                    <td className="p-2.75 text-left text-[13px] w-[10%] font-medium text-on-surface">
                      {field.price * field.quantity}
                    </td>
                    <td className="p-2.75 flex gap-2 font-medium text-right justify-center items-center w-[15%] text-on-surface">
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={lineItemsForm.handleSubmit(
                          handleLineItemsUpdate
                        )}
                        className="flex items-center gap-1.25 text-[13px] text-on-primary bg-primary hover:opacity-90 transition-opacity px-md py-xs rounded-lg"
                      >
                        <span id="action-label">Save</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={index}>
                    <td className="py-2.75 text-shadow-surface-bright text-[14px] w-[40%] text-on-surface">
                      {field.description}
                    </td>
                    <td className="py-2.75 text-left  text-[13px] w-[10%] text-on-surface-variant">
                      {field.quantity}
                    </td>
                    <td className="py-2.75 text-left  text-[13px] w-[15%] text-on-surface-variant">
                      {field.price}
                    </td>
                    <td className="py-2.75 text-left text-[13px] w-[15%] font-medium text-on-surface">
                      {field.price * field.quantity}
                    </td>
                    <td className="py-2.75 font-medium text-left w-[10%] text-on-surface">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          edit
                        </span>
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div className="border-t border-outline-variant/30 mt-sm pt-3.5 flex justify-end">
            <div className="min-w-52.5">
              <div className="flex justify-between mb-2.5">
                <span className="text-[13px] text-on-surface-variant">
                  Subtotal
                </span>
                <span className="text-[13px] text-on-surface">
                  {fields
                    .reduce(
                      (total: number, field: any) =>
                        total + field.price * field.quantity,
                      0
                    )
                    .toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                </span>
              </div>
              <div className="border-t border-outline-variant/30 pt-2.5 flex justify-between">
                <span className="text-[15px] font-medium text-on-surface">
                  Total
                </span>
                <span className="text-[15px] font-medium text-on-surface">
                  {fields
                    .reduce(
                      (total: number, field: any) =>
                        total + field.price * field.quantity,
                      0
                    )
                    .toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
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
