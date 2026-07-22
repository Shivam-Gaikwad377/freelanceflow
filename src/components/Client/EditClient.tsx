"use client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClientSchema } from "@/schemas/createClient.schema";
import ApiResponse from "@/types/ApiResponse";
import { Client } from "@/types/Model.types";
import PrimaryButton from "../PrimaryButton";

import SecondaryButton from "../SecondaryButton";

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
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      company: client?.company || "",
      description: client?.description || "",
      status: client?.status || "active",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;
  const wasOpen = useRef(false);
  // Populate form whenever the target client changes
  useEffect(() => {
    console.log("reset effect ran — open:", open, "client:", client);
    if (open && client) {
      console.log("Populating form with client data:", client);
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone ?? "",
        company: client.company ?? "",
        description: client.description ?? "",
        status: client.status,
      });
    }
    
  }, [open, client, reset]);

  const onSubmit = async (data: z.infer<typeof createClientSchema>) => {
    
      console.log("RHF data about to submit:", data);
    try {
      const response = await axios.patch<ApiResponse>(
        `/api/Clients/${client?._id}`,
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
console.log("EditClientDrawer RENDERED, open:", open, "client:", client);
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
        className={`fixed right-0 top-0 h-full w-full max-w-130 bg-surface z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
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
                className="form-input-text"
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
                className="form-input-text"
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
                  className="form-input-text"
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
                  className="form-input-text"
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
                className="form-input-text"
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
                      className="peer form-input-radio"
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
                      className="peer form-input-radio"
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
           <SecondaryButton
              label="Cancel"
              onClick={() => onClose()}
              icon="close"
            />
            <PrimaryButton
              label= {isSubmitting ? "Saving..." : "Save Changes"}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              fontSize="medium"
            />
            
          </div>
        </form>
      </div>
    </>
  );
};

export default EditClientDrawer;
