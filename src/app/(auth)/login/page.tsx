"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { signInSchema } from "@/schemas/signin.schema";
import Gradient from "../../../../public/Gradient.png";
import { toast } from "sonner";
import { Link } from "react-email";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const {
    register,
   
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        toast.error(result.error, { position: "top-right" });
        setError(result.error);
      } else if (result?.ok) {
        toast.success("Login successful! Redirecting to dashboard...", {
          position: "top-right",
        });
        router.replace("/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Invalid email or password" + error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="antialiased flex flex-col min-h-full p-0 m-0 relative pt-20 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-full">
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-30"
        >
          <Image
            alt=""
            className="w-full h-full object-cover scale-110 blur-2xl"
            src={Gradient}
          />
        </div>
        <div className="w-full max-w-110 bg-surface-container-lowest rounded-lg border border-outline-variant p-xl shadow-level-3 relative z-10 flex flex-col backdrop-blur-sm">
         
          <div className="flex flex-col items-center text-center mb-xl">
            <div className="flex items-center gap-sm mb-lg">
             
              <span className="font-headline-sm text-headline-sm text-primary">
                FreelanceFlow
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">
              Welcome back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your credentials to access your workspace.
            </p>
          </div>
         
          <Form
            control={form.control}
            onSubmit={({ data }) => onSubmit(data)}
            className="flex flex-col gap-lg"
          >
           
            <div className="flex flex-col gap-xs">
              <label
                className="font-label-md text-label-md text-on-surface"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                {...register("identifier")}
                className="w-full px-md py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                id="email"
                name="identifier"
                placeholder="you@example.com"
                type="identifier"
              />
            </div>
          
            {error && (
              <div className="text-error font-body-sm text-body-sm">
                {error}
              </div>
            )}
         
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors duration-200"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                className="w-full px-md py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            {errors.password && (
              <div className="text-error font-body-sm text-body-sm">
                {errors.password.message}
              </div>
            )}
           
            <button
              className="w-full py-3 cursor-pointer active:scale-95 px-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md rounded-lg transition-all duration-200 flex justify-center items-center mt-sm"
              type="submit"
              disabled={isSubmitting}
            >
              Log In
            </button>
          </Form>
         
          <div className="mt-xl text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?
              <a
                className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors duration-200"
                href="#"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
