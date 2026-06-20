"use client";
import React from "react";
import Link from "next/link";
import { Form, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ApiResponse from "@/types/ApiResponse";
import { createClientSchema } from "@/schemas/createClient.schema";
interface AddClientProps {
    open: boolean;
    onClose: () => void;

}
const AddClient = ({ open, onClose }: AddClientProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      description: "",
      status: "active", // Set the default status to "active"
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof createClientSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/Clients", data);

      // Only 2xx reaches here
      if (response.data.success) {
        toast.success("Client added successfully!", {
          position: "top-right",
        });
        onClose(); // Close the AddClient component/modal
        router.refresh(); // Refresh the clients list on the page
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

  const [isLoading, setIsLoading] = useState(false);
  return (
    <main className="  p-5 min-h-screen">
      <div className=" mx-auto">
        {/* <!-- Header --> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-3">
          <div>
            <div className="inline-flex items-center gap-xs text-primary  font-label-md mb-xs transition-all">
              <span className="material-symbols-outlined  text-[18px]">
                arrow_back
              </span>
              <Link className="hover:underline" href="/clients">
                Back to Clients
              </Link>
            </div>
            <h1 className="font-headline-lg  text-headline-lg md:text-headline-lg-mobile text-on-surface">
              Add New Client
            </h1>
          </div>
        </div>
        {/* <!-- Form Container --> */}
        <div className="glass-card rounded-xl shadow-sm overflow-hidden mb-xl">
          <div className="p-lg md:p-xl">
            <Form
              control={form.control}
              onSubmit={({ data }) => onSubmit(data)}
              className="space-y-lg"
            >
              {/* <!-- Primary Info Grid --> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                    placeholder="e.g. Jonathan Smith"
                    required={true}
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 5,
                        message: "Name must be at least 5 characters long",
                      },
                    })}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                    placeholder="jonathan@example.com"
                    required={true}
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
              </div>
              {/* <!-- Secondary Info Grid --> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant block">
                    Phone Number
                  </label>
                  <input
                    className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
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
                    {...register("company", {
                      required: "Company name is required",
                    })}
                  />
                </div>
              </div>

              {/* <!-- Description --> */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Description
                </label>
                <textarea
                  className="w-full bg-surface border border-outline rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                  placeholder="Street Address, Suite, City, ZIP, Country"
                  rows={3}
                    {...register("description")}
                ></textarea>
              </div>
              {/* <!-- Initial Status --> */}
              <div className="space-y-md pt-md">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  Initial Status
                </label>
                <div className="flex items-center gap-xl">
                  <label className="flex items-center gap-md cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        className="peer h-5 w-5 appearance-none rounded-full border border-outline checked:border-primary focus:ring-primary transition-all"
                       
                        type="radio"
                        value="active"
                        {...register("status", { required: true })}
                      />
                      <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
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
                        {...register("status", { required: true })}
                      />
                      <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                      Inactive
                    </span>
                  </label>
                </div>
              </div>
              {/* <!-- Actions --> */}
              <div className="flex items-center justify-end gap-md pt-lg border-t border-outline-variant/30 mt-xl">
                <button
                  className="px-xl py-[12px] text-primary font-label-md hover:bg-surface-container transition-colors rounded-lg"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-primary text-on-primary px-xl py-[12px] rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
                  type="submit"
                >
                  Create Client
                </button>
              </div>
            </Form>
          </div>
        </div>
        {/* <!-- Visual Decorative Section --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg opacity-80">
          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
            <span className="material-symbols-outlined text-primary">
              security
            </span>
            <h3 className="font-label-md text-on-surface">Secure Data</h3>
            <p className="text-body-sm text-on-surface-variant">
              Your client's information is encrypted and never shared with third
              parties.
            </p>
          </div>
          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
            <span className="material-symbols-outlined text-primary">
              auto_graph
            </span>
            <h3 className="font-label-md text-on-surface">Auto-Sync</h3>
            <p className="text-body-sm text-on-surface-variant">
              Invoices and project details will automatically link to this
              client record.
            </p>
          </div>
          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
            <span className="material-symbols-outlined text-primary">
              notifications_active
            </span>
            <h3 className="font-label-md text-on-surface">Smart Alerts</h3>
            <p className="text-body-sm text-on-surface-variant">
              Get notified when it's time to follow up or send a scheduled
              invoice.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddClient;
