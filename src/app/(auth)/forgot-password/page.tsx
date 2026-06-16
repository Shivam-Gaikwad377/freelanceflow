"use client"
import axios from "axios";
import React from "react";
import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import ApiResponse from "@/types/ApiResponse";
const page = () => {
    
    const [email, setEmail] = useState("");
    const router = useRouter();

    const onSubmit = async () => {
       
        if(!email){
            toast.error("Please enter your email address.");
            return;
        }
        try {
            const response: ApiResponse = await axios.post("/api/auth/forgot-password", {email});
            if (response.data.success) {
                toast.success("Password reset email sent successfully. Please check your email for the OTP.");
                router.replace("/reset-password?email=" + email);
            }
        } catch (error) {
            toast.error("Failed to send password reset otp.");
        }
    
    };

  return (
    <div className="antialiased  flex flex-col min-h-full p-0 m-0 relative pt-20 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-full">
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-30"
        >
          <img
            alt=""
            className="w-full h-full object-fit scale-110 blur-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5cLUWEf_p8Gvu43B9igYz_nNUVekCCOffUwGQTPRoPH5Dv-LyuZP1lV7BxAY8euVUlOgn4TfdWe5k3sWh1W2hm8fcuRC1gDae0tFFrddkytYuucosY2ZSo3qJYZBnY3UuHH9H3N7LBryRFwLhwmQsmEtYyNyxht3ARorldYHsmRYjfsev0gT3ksHXTeP8rmn9_418j3z64-QprUK7TE-jHrf_X6Eo_27DgqeDSWzTazURLWHqM9m_U5i32sHArWwNdA3blQ_BK_4m"
          />
        </div>
        <div className="w-full max-w-110 bg-background text-on-background glass-card rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-in-out transform scale-100">
          <div className="px-xl py-xxl flex flex-col gap-lg">
            {/* <!-- Brand Identity --> */}
            <div className="flex flex-col items-center gap-sm">
              <span className="font-display text-headline-md font-bold text-primary">
                FreelanceFlow
              </span>
            </div>
            {/* <!-- Content Header --> */}
            <div className="text-center space-y-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface">
                Reset your password
              </h1>
              <p
                className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                id="subtext"
              >
                Enter your email address and we will send you an OTP to reset
                your password.
              </p>
            </div>
            {/* <!-- Email View --> */}
            <div
              className="space-y-lg transition-opacity duration-300"
              id="email-view"
            >
              <div className="space-y-unit">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block ml-unit"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  className="w-full px-md py-sm border border-outline rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button onClick={ (e) => onSubmit()} className="w-full py-md px-lg bg-primary hover:bg-primary-container text-on-primary font-body-md font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-sm group">
                <span>Send OTP</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
            <div className="flex items-center justify-center flex-col ">
              <a
                className="flex items-center gap-xs font-label-md text-label-md  text-primary hover:text-primary-container transition-colors group"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                <span>Back to Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
