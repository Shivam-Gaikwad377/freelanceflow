"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { updateInvoiceSchema } from "@/schemas/updateInvoice.schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetch from "@/app/hooks/useFetch";
import BackButton from "@/components/BackButton";
import { Project, Client, Invoice } from "@/types/Model.types";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import StatusBadge from "@/components/Invoice/StatusBadge";
import ClientInitialBadge from "@/components/Client/ClientInitialBadge";
import {
  InvoiceDetailSkeleton
} from "@/components/Skeletals/Invoice";
import { InvoiceLineItem, InvoicePDFProps } from "@/components/Invoice/InvoicePDF";
const Page = () => {
  const { data: session } = useSession();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const invoiceId = pathname.split("/").pop();
  const [client, setClient] = useState<Client | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDueDate, setEditingDueDate] = useState<boolean>(false);
  function toDateInputValue(date?: Date | string): string {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0]; // "2026-07-08"
  }
  const lineItemsForm = useForm<z.infer<typeof updateInvoiceSchema>>({
    resolver: zodResolver(updateInvoiceSchema) as unknown as any,
    defaultValues: {
      lineItems: invoice?.lineItems || [],
      dueDate: invoice?.dueDate,
      description: invoice?.lineItems[0]?.description || "",
    },
  });
  const {
    data: invoiceData,
    loading: loadingInvoice,
    error,
  } = useFetch(`/api/Invoices/${invoiceId}`);
  const {
    register,
    reset,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = lineItemsForm;
  const { fields, append, remove } = useFieldArray({
    control: lineItemsForm.control,
    name: "lineItems",
  });
  const watchLineItems = watch("lineItems");

  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData);
      setClient(invoiceData.clientId);
      setProject(invoiceData.projectId);

    }
  }, [invoiceData]);

  const handlePaid = async () => {
    try {
      const response = await axios.patch(`/api/Invoices/${invoiceId}`, {
        status: "Paid",
        paidAt: new Date(),
      });
      if (response.data.success) {
        setInvoice((prevInvoice: Invoice | null) =>
          prevInvoice
            ? ({ ...prevInvoice, status: "Paid", paidAt: new Date() } as Invoice)
            : prevInvoice
        );
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
        description: invoice.lineItems[0]?.description || "",
      });
    }
  }, [invoice, reset]);
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDueDate = e.target.value;
    try {
      const response = await axios.patch(`/api/Invoices/${invoiceId}`, {
        dueDate: newDueDate,
      });
      if (response.data.success) {
         setInvoice((prevInvoice: Invoice | null) =>
          prevInvoice
            ? ({ ...prevInvoice, dueDate: newDueDate } as unknown as Invoice)
            : prevInvoice
        );
        toast.success("Due date updated successfully");
        setEditingDueDate(false);
      }
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Error updating due date");
    }
  };
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!invoice || !client || !project) return;
    setIsDownloading(true);
    try {
      if(session?.user?.plan !== "premium") {
        toast.error("Download feature is available for premium users only. Please upgrade your plan.");
        return;
      }
      const { pdf } = await import("@react-pdf/renderer");
      const { InvoicePDF } = await import("@/components/Invoice/InvoicePDF");
      const blob = await pdf(
        // invoice may have optional fields, assert to any for PDF generation
        <InvoicePDF
          invoice={invoice as unknown as InvoicePDFProps["invoice"]}
          client={client as InvoicePDFProps["client"]}
          project={project as InvoicePDFProps["project"]}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  // Shared field renderers so the desktop <table> row and the mobile <card>
  // row register the exact same react-hook-form fields — one source of
  // validation truth instead of two copies that can drift apart.
  const descriptionField = (index: number, field: InvoiceLineItem) => (
    <input
      className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
      placeholder="Item description"
      type="text"
      defaultValue={field.description}
      {...register(`lineItems.${index}.description`, {
        required: "Description is required",
        minLength: {
          value: 5,
          message: "Description must be at least 5 characters long",
        },
      })}
    />
  );

  const quantityField = (index: number, field: InvoiceLineItem) => (
    <input
      className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
      placeholder="1"
      type="number"
      inputMode="numeric"
      min={1}
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
  );

  const priceField = (index: number, field: InvoiceLineItem) => (
    <input
      className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
      placeholder="0.00"
      type="number"
      inputMode="decimal"
      min={0}
      step="0.01"
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
  );

  const lineItemActions = (index: number) => (
    <>
      <button
        onClick={() => {
          const savedCount = invoice?.lineItems?.length ?? 0;
          if (index >= savedCount) {
            // it's a newly appended, unsaved row — remove it entirely
            remove(index);
          } else {
            // it's an existing row — revert any typed-but-unsaved edits
            lineItemsForm.resetField(`lineItems.${index}`, {
              defaultValue: invoice!.lineItems[index],
            });
          }
          setEditingIndex(null);
        }}
        className="flex items-center gap-1.25 text-[13px] text-on-surface-variant hover:text-primary transition-colors px-md py-xs rounded-lg border border-outline-variant/50 bg-surface"
      >
        Cancel
      </button>
      <button
        onClick={async () => {
          // Manually trigger validation for just this row's fields
          const isValid = await trigger([
            `lineItems.${index}.description`,
            `lineItems.${index}.quantity`,
            `lineItems.${index}.price`,
          ]);
          if (isValid) {
            handleLineItemsUpdate({ lineItems: watchLineItems });
          }
        }}
        className="flex items-center gap-1.25 text-[13px] text-on-primary bg-primary hover:opacity-90 transition-opacity px-md py-xs rounded-lg"
      >
        <span id="action-label">Save</span>
      </button>
    </>
  );

  return (
    <>
      {loadingInvoice ? (
        <InvoiceDetailSkeleton />
      ) : (
        <div className="flex-1 px-md sm:px-xl mx-auto w-full">
          <div className="py-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm mb-lg">
              <BackButton
                onBack={() => router.push("/invoices")}
                label="Back to Invoices"
              />
              <div className="flex flex-wrap items-center gap-sm">
                <SecondaryButton
                  label="Download"
                  icon="download"
                  onClick={handleDownload}
                />
                {invoice?.status !== "Paid" ? (
                  <PrimaryButton
                    label="Mark as Paid"
                    onClick={handlePaid}
                    icon="check_circle"
                    fontSize="medium"
                  />
                ) : (
                  <p className="text-label-lg text-on-surface-variant"></p>
                )}
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-lg mb-md">
              <div className="flex flex-wrap items-start justify-between gap-sm">
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
                >
                  <StatusBadge
                    color={
                      invoice?.status === "Paid"
                        ? "success"
                        : invoice?.status === "pending"
                          ? "normal"
                          : "error"
                    }
                    label={invoice?.status || "Status"}
                    fontSize="large"
                  />
                </span>
              </div>
              <div className="border-t border-outline-variant/30 mt-md pt-md grid grid-cols-1 sm:grid-cols-3 gap-md">
                <div>
                  <p className="text-label-md text-on-surface-variant m-0 mb-[4px]">
                    Issue date
                  </p>
                  <p className="text-label-md font-medium m-0 text-on-surface">
                    {invoice
                      ? new Date(invoice.issueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant m-0 mb-[4px]">
                    Due date
                  </p>
                  {editingDueDate ? (
                    <input
                      type="date"
                      defaultValue={toDateInputValue(invoice?.dueDate)}
                      onChange={handleDateChange}
                      className="text-label-md font-medium m-0 text-on-surface w-full sm:w-auto"
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
                        className="material-symbols-outlined opacity-100 sm:opacity-0 duration-200 transition-opacity sm:group-hover:opacity-100 text-label-sm"
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
                <div className="flex items-center gap-3 mb-sm flex-wrap">
                  <ClientInitialBadge
                    name={client?.name || "Client Name"}
                    size="small"
                  />
                  <div className="flex gap-2 flex-wrap items-center">
                    <p
                      onClick={() =>
                        router.replace(`/clients/${invoice?.clientId}`)
                      }
                      className="cursor-pointer text-md font-medium m-0 mb-0.75 text-on-surface"
                    >
                      {client?.name}
                    </p>
                    <StatusBadge
                      color={client?.status === "active" ? "success" : "normal"}
                      label={client?.status || "Status"}
                      fontSize="small"
                    />
                  </div>
                </div>
                <div className="border-t border-outline-variant/30 pt-2.5 flex flex-col gap-1.75">
                  <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75 break-all">
                    <span className="material-symbols-outlined text-[15px] shrink-0">
                      mail
                    </span>
                    {client?.email}
                  </p>
                  <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                    <span className="material-symbols-outlined text-[15px] shrink-0">
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
                  <p
                    onClick={() =>
                      router.replace(`/projects/${project?._id}`)
                    }
                    className="cursor-pointer text-[14px] font-medium m-0 text-on-surface wrap-break-word"
                  >
                    {project?.title}
                  </p>
                </div>
                <div className="border-t border-outline-variant/30 pt-2.5 flex flex-col gap-1.75">
                  <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                    <span className="material-symbols-outlined text-[15px] shrink-0">
                      {project?.status === "completed"
                        ? "check_circle"
                        : project?.status === "in progress"
                          ? "clock_loader_40"
                          : "pending"}
                    </span>
                    {project?.status}
                  </p>
                  <p className="text-[13px] text-on-surface-variant m-0 flex items-center gap-1.75">
                    <span className="material-symbols-outlined text-[15px] shrink-0">
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
              <div className="flex flex-wrap justify-between gap-sm px-1">
                <p className="text-[11px] text-on-surface-variant tracking-[0.07em] m-0 mb-sm uppercase font-semibold">
                  Line items
                </p>
                <SecondaryButton
                  label="Add Item"
                  icon="add"
                  onClick={async () => {
                    // 1. Validate all existing line items
                    const isValid = await trigger("lineItems");
                    if (!isValid) {
                      toast.error("please enter all fields.", {
                        position: "top-right",
                      });
                    }
                    // 2. Only add a new row if all current rows are valid
                    if (isValid || editingIndex === null) {
                      const newIndex = fields.length;
                      append({
                        description: "",
                        quantity: 1,
                        price: 0,
                      });
                      // 3. Put the newly added row into edit mode
                      setEditingIndex(newIndex);
                    }
                  }}
                  fontSize="small"
                />
              </div>

              {/* Table layout — md screens and up, where 5 columns have room to breathe */}
              <div className="hidden md:block">
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
                    {fields.map((field: InvoiceLineItem, index: number) =>
                      editingIndex === index ? (
                        <tr key={index}>
                          <td className="p-2.75 text-right text-shadow-surface-bright text-[14px] w-[40%] text-on-surface">
                            {descriptionField(index, field)}
                          </td>
                          <td className="p-2.75 text-right  text-[13px] w-[10%] text-on-surface-variant">
                            {quantityField(index, field)}
                          </td>
                          <td className="p-2.75 text-right  text-[13px] w-[15%] text-on-surface-variant">
                            {priceField(index, field)}
                          </td>
                          <td className="p-2.75 text-left text-[13px] w-[10%] font-medium text-on-surface">
                            {field.price * field.quantity}
                          </td>
                          <td className="p-2.75 flex gap-2 font-medium text-right justify-center items-center w-[15%] text-on-surface">
                            {lineItemActions(index)}
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
                            <SecondaryButton
                              onClick={() => setEditingIndex(index)}
                              label="Edit"
                              icon="edit"
                              fontSize="small"
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Card layout — below md, where a fixed 5-column table would squeeze */}
              <div className="flex flex-col gap-sm md:hidden mt-sm">
                {fields.map((field: InvoiceLineItem, index: number) =>
                  editingIndex === index ? (
                    <div
                      key={index}
                      className="border border-outline-variant/50 rounded-lg p-md flex flex-col gap-sm"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                          Description
                        </label>
                        {descriptionField(index, field)}
                      </div>
                      <div className="grid grid-cols-2 gap-sm">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                            Qty
                          </label>
                          {quantityField(index, field)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                            Rate
                          </label>
                          {priceField(index, field)}
                        </div>
                      </div>
                      <p className="text-[13px] text-on-surface-variant m-0">
                        Total:{" "}
                        <span className="font-medium text-on-surface">
                          {field.price * field.quantity}
                        </span>
                      </p>
                      <div className="flex gap-2 justify-end pt-1">
                        {lineItemActions(index)}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="border border-outline-variant/30 rounded-lg p-md flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-sm">
                        <p className="text-[14px] font-medium text-on-surface m-0 wrap-break-word">
                          {field.description}
                        </p>
                        <SecondaryButton
                          onClick={() => setEditingIndex(index)}
                          label="Edit"
                          icon="edit"
                          fontSize="small"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-sm border-t border-outline-variant/30 pt-2.5">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant m-0">
                            Qty
                          </p>
                          <p className="text-[13px] font-medium text-on-surface m-0">
                            {field.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant m-0">
                            Rate
                          </p>
                          <p className="text-[13px] font-medium text-on-surface m-0">
                            {field.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant m-0">
                            Total
                          </p>
                          <p className="text-[13px] font-medium text-on-surface m-0">
                            {field.price * field.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-outline-variant/30 mt-sm pt-3.5 flex justify-end">
                <div className="w-full sm:w-auto sm:min-w-52.5">
                  <div className="flex justify-between mb-2.5">
                    <span className="text-[13px] text-on-surface-variant">
                      Subtotal
                    </span>
                    <span className="text-[13px] text-on-surface">
                      {fields
                        .reduce(
                          (total: number, field: InvoiceLineItem) =>
                            total + field.price * field.quantity,
                          0
                        )
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                    </span>
                  </div>
                  <div className="border-t border-outline-variant/30 pt-2.5 flex justify-between">
                    <span className="text-[15px] font-medium text-on-surface">
                      Total
                    </span>
                    <span className="text-[15px] font-medium text-on-surface">
                      {invoice?.amount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}
    </>
  );
};

export default Page;