"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClientSchema } from "@/schemas/createClient.schema";
import ApiResponse from "@/types/ApiResponse";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  description?: string;
  status: "active" | "inactive";
}

interface EditClientDrawerProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
}

const EditClientDrawer = ({ open, onClose, client }: EditClientDrawerProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      description: "",
      status: "active",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Populate form whenever the target client changes
  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone ?? "",
        company: client.company ?? "",
        description: client.description ?? "",
        status: client.status,
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: z.infer<typeof createClientSchema>) => {
    if (!client) return;
    try {
      const response = await axios.patch<ApiResponse>(
        `/api/Clients/${client._id}`,
        data
      );
      if (response.data.success) {
        toast.success("Client updated successfully!", {
          position: "top-right",
        });
        onClose();
        router.refresh();
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      form.setError("root", {
        type: "server",
        message: message || "An unexpected error occurred",
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[520px] bg-surface z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-xl py-lg border-b border-outline-variant/30 shrink-0">
          <div>
            <p className="text-body-sm text-on-surface-variant">Editing</p>
            <h2 className="font-headline-sm text-on-surface">
              {client?.name || "Client"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ── Scrollable form body + sticky footer ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-xl py-lg space-y-lg">
            {/* Server error */}
            {errors.root && (
              <div className="flex items-center gap-sm bg-error-container text-on-error-container text-body-sm px-md py-sm rounded-lg">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                {errors.root.message}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                placeholder="e.g. Jonathan Smith"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-error text-body-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                placeholder="jonathan@example.com"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-error text-body-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone + Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Phone Number
                </label>
                <input
                  className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  {...register("phone")}
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Business / Company Name
                </label>
                <input
                  className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                  placeholder="Acme Corp"
                  type="text"
                  {...register("company")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                Description
              </label>
              <textarea
                className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                placeholder="Street Address, Suite, City, ZIP, Country"
                rows={3}
                {...register("description")}
              />
            </div>

            {/* Status */}
            <div className="space-y-md pt-md">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                Status
              </label>
              <div className="flex items-center gap-xl">
                <label className="flex items-center gap-md cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      className="peer h-5 w-5 appearance-none rounded-full border border-outline checked:border-primary focus:ring-primary transition-all"
                      type="radio"
                      value="active"
                      {...register("status")}
                    />
                    <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                    Active
                  </span>
                </label>
                <label className="flex items-center gap-md cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      className="peer h-5 w-5 appearance-none rounded-full border border-outline checked:border-primary focus:ring-primary transition-all"
                      type="radio"
                      value="inactive"
                      {...register("status")}
                    />
                    <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                    Inactive
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ── Footer (always visible) ── */}
          <div className="flex items-center justify-end gap-md px-xl py-lg border-t border-outline-variant/30 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-xl py-[12px] text-primary font-label-md hover:bg-surface-container transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-on-primary px-xl py-[12px] rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    save
                  </span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditClientDrawer;
