"use client";

import React from "react";
import * as z from "zod";
import { signupSchema } from "@/schemas/signup.schemas";
import { Form, useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ApiResponse from "@/types/ApiResponse";
const page = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [existingEmail, setExistingEmail] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const response: ApiResponse = await axios.post("/api/auth/signup", data);

      // Only 2xx reaches here
      if (response.success) {
        toast.success(
          "Signup successful! Please check your email for the OTP.",
          {
            position: "top-right",
          }
        );
        router.replace(`/verify?email=${data.email}`);
      }
    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 401) {
        setExistingEmail(true); // ← now actually called
        toast.error(message || "Email already in use.", {
          position: "top-right",
        });
      } else {
        form.setError("root", {
          type: "server",
          message: message || "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <div className="bg-surface-container-lowest font-body-md text-on-background antialiased min-h-screen flex selection:bg-primary selection:text-on-primary">
      <div className="flex w-full min-h-screen">
        {/* <!-- Left Section: Form --> */}
        <main className="w-full lg:w-1/2 flex flex-col justify-center px-lg sm:px-xl gap-10  lg:px-xxl py-xl relative">
          {/* <!-- Brand Anchor (Mobile/Tablet visible, Desktop optional but good for context) --> */}
          <div className="absolute top-lg left-lg sm:top-xl sm:left-xl">
            <a
              className="font-display font-bold text-headline-sm text-primary flex items-center gap-sm"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                layers
              </span>
              FreelanceFlow
            </a>
          </div>
          <div className="w-full  mx-auto mt-xxl">
            <div className="mb-xl w-auto p-sm">
              <h1 className="font-display text-headline-lg text-on-surface text-center mb-sm">
                Create your account
              </h1>
              <p className="font-body-md text-center text-on-surface-variant">
                Join the minimalist workspace designed for solo professionals.
              </p>
            </div>
            <Form
              control={form.control}
              onSubmit={({ data }) => onSubmit(data)}
              className="space-y-lg"
            >
              {/* <!-- Full Name --> */}
              <div className="flex flex-col gap-xs">
                <label
                  className="font-label-md text-on-surface"
                  htmlFor="fullName"
                >
                  Full name
                </label>
                <input
                  className="w-full border border-outline-variant rounded-lg px-md py-2.5 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-container-lowest shadow-sm"
                  id="fullName"
                  placeholder="firstname lastname"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 5,
                      message: "Name must be at least 5 characters long",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof errors.name.message === "string"
                      ? errors.name.message
                      : "Invalid name"}
                  </p>

                )}
              </div>
              {/* <!-- Email --> */}
              <div className="flex flex-col gap-xs">
                <label
                  className="font-label-md text-on-surface"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  className="w-full border border-outline-variant rounded-lg px-md py-2.5 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-container-lowest shadow-sm"
                  id="email"
                  placeholder="xyz@example.com"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof errors.email.message === "string"
                      ? errors.email.message
                      : "Invalid email address"}
                  </p>
                )}
              </div>
              {/* <!-- Password --> */}
              <div className="flex flex-col gap-xs">
                <label
                  className="font-label-md text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full border border-outline-variant rounded-lg px-md py-2.5 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-container-lowest shadow-sm"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                />
                {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                    {typeof errors.password.message === "string"
                      ? errors.password.message
                      : "Invalid password"}
                  </p>
                )}
              </div>
              {/* <!-- Primary Action --> */}
              <button
                disabled={isSubmitting}
                className="w-full d bg-primary cursor-pointer hover:bg-surface-tint active:scale-95 text-on-primary font-label-md rounded-lg py-3 px-lg transition-all shadow-[0_4px_14px_0_rgba(70,72,212,0.39)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.23)] hover:-translate-y-px"
                type="submit"
              >
                Create Account
              </button>
            </Form>
            <div className="mt-xl relative flex items-center">
              <div className="grow border-t border-outline-variant"></div>
              <span className="shrink-0 mx-md font-body-sm text-on-surface-variant">
                Or continue with
              </span>
              <div className="grow border-t border-outline-variant"></div>
            </div>
            <div className="mt-lg grid grid-cols-2 gap-md">
              <button
                className="flex items-center justify-center gap-sm w-auto border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md rounded-lg py-2.5 px-md transition-colors shadow-sm"
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Google
              </button>
              <button
                className="flex items-center justify-center gap-sm w-auto border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md rounded-lg py-2.5 px-md transition-colors shadow-sm"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-on-surface"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  ></path>
                </svg>
                GitHub
              </button>
            </div>
            <p className="mt-lg text-center font-body-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link
                className="font-label-md text-primary hover:underline"
                href="/login"
              >
                Log in
              </Link>
            </p>
          </div>
          <div className="absolute bottom-lg left-lg sm:left-xl font-body-sm text-outline">
            © 2024 FreelanceFlow.
          </div>
        </main>
        {/* <!-- Right Section: Visual Presentation (Hidden on Mobile) --> */}
        <aside className="hidden lg:flex w-1/2 mesh-gradient relative overflow-hidden flex-col items-center justify-between p-xxl text-on-primary">
          {/* <!-- Abstract decorative elements --> */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* <!-- Product Illustration Centerpiece --> */}
          <div className="relative z-10 grow flex items-center justify-center my-xl">
            <div className="relative w-full aspect-square rounded-2xl bg-on-primary/5 border border-on-primary/10 backdrop-blur-sm p-lg shadow-2xl flex items-center justify-center overflow-hidden group hover:bg-on-primary/10 transition-colors duration-500">
              <img
                alt="FreelanceFlow SaaS Dashboard Illustration"
                className="w-full h-full object-cover rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ6jN1lR8L1uOkGQo2qRLuYU_HYGktzDw8dPT7huLCN9hO35IqkyXRp12Nar72Lw0-BmNIpOxMxZFll68YdUk93l32ZeITbqcU2gFyQyCEktvGhv5Tf_QkS4Cs5wUZSNrQzL7OnNhDTRfAsEceiqmM7xS-3l9Blt__ZUwj97im5MoH-CQniqEbMkElIPehyEjMAfYT4RPVHGLm9ZzSzgaevCqG3mHde-n5EIbT1qeQzprzSE1NYuM_E7TcjxzMqBJdbK8vhHgPqkJH"
              />
              {/* <!-- Floating abstract UI elements to simulate the prompt's request --> */}
              <div
                className="absolute top-1/4 right-8 bg-surface-container-lowest/90 backdrop-blur border border-outline-variant/30 rounded-lg p-sm shadow-lg flex items-center gap-xs animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="font-label-sm text-on-surface">Free</span>
              </div>
              <div
                className="absolute bottom-1/4 left-8 cursor-pointer bg-surface-container-lowest/90 backdrop-blur border border-outline-variant/30 rounded-lg p-sm shadow-lg flex items-center gap-xs animate-pulse"
                style={{ animationDuration: "4s" }}
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  pie_chart
                </span>
                <span className="font-label-sm text-on-surface">Analytics</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default page;
