"use client";

import React from "react";
import * as z from "zod";
import { signupSchema } from "@/schemas/signup.schemas";
import { Form, useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import ApiResponse from "@/types/ApiResponse";
import Register from "../../../../public/Register.jpg";

const Page = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    
    
    formState: { errors, isSubmitting },
  } = form;
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const response: ApiResponse = await axios.post("/api/auth/signup", data);

     
      if (response.data.success) {
        toast.success(
          "Signup successful! Please check your email for the OTP.",
          {
            position: "top-right",
          }
        );
        router.replace(`/verify?email=${data.email}`);
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;

      if (status === 401) {
         
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
      
        <main className="w-full lg:w-1/2 flex flex-col justify-center px-lg sm:px-xl gap-10  lg:px-xxl py-xl relative">
        
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
            
            
            <p className="mt-lg text-center font-body-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link
                className="font-label-md text-primary hover:underline"
                href="/login"
              >
                Log in
              </Link>
            </p>
          <div className="absolute bottom-lg left-lg sm:left-xl font-body-sm text-outline">
            © {new Date().getFullYear()} FreelanceFlow.
          </div>
          </div>
        </main>
       
        <aside className="hidden lg:flex w-1/2 mesh-gradient relative  flex-col p-xxl  text-on-primary">
         
          <div className="relative z-10 grow  my-xl">
            <div className=" w-full h-full rounded-2xl bg-on-primary/5 border border-on-primary/10 backdrop-blur-sm p-lg shadow-2xl my-xl  group hover:bg-on-primary/10 transition-colors duration-500">
              <Image
                alt="FreelanceFlow SaaS Dashboard Illustration"
                loading="lazy"
                fill
                sizes={"100vw"}
                className=" rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                src={Register}
              />
            
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

export default Page;
