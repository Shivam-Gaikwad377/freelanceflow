"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import ApiResponse from "@/types/ApiResponse";

import { useSearchParams } from "next/navigation";

const page = () => {
  const [timer, setTimer] = useState(5); // 5 minutes in seconds
  const [resend, setResend] = useState(false);
  const searchParams = useSearchParams();
const email = searchParams.get("email") || ""
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // Initialize an array of 6 empty strings
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    
      // Only allow digits
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // Ensure only the last digit is kept
      setOtp(newOtp);
    
    if (index < 5 && value) {
      (inputRef.current as (HTMLInputElement | null)[] | null)?.[
        index + 1
      ]?.focus(); // Move to the next input if it exists
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      (inputRef.current as (HTMLInputElement | null)[] | null)?.[
        index - 1
      ]?.focus(); // Move to the previous input if it exists
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    try {
      const response: ApiResponse = await axios.post("/api/auth/verify-email", {
        email,
        verificationToken: enteredOtp,
      });
      router.replace("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    }
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData?.getData("text")?.slice(0, 6);
    if (!pasted || !/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);

    // focus last filled field
    (inputRef.current as (HTMLInputElement | null)[] | null)?.[
      Math.min(pasted.length - 1, 5)
    ]?.focus();
  };
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setResend(true);
    }
  }, [timer]);
  const handleResend = async () => {
    try {
      const response = await axios.post("/api/auth/resend-verification-code", {
        email,
      });
      if (response.data.success) {
        setTimer(5);
        setResend(false);
        setError(null);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to resend verification code. Please try again."
      );
      
      return;
    }
  };

  return (
    <div className="antialiased flex flex-col min-h-full p-0 m-0 relative pt-20 overflow-x-hidden">
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
        <div className="w-full max-w-120">
          {/* <!-- Brand / Logo Area --> */}
          <div className="text-center mb-xl">
            <h1 className="font-display text-display text-primary tracking-tight">
              FreelanceFlow
            </h1>
          </div>
          {/* <!-- Main Card --> */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-2 p-lg sm:p-xl flex flex-col items-center">
            {/* <!-- Icon --> */}
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-md">
              <span
                className="material-symbols-outlined text-primary text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_person
              </span>
            </div>
            {/* <!-- Header Content --> */}
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm text-center">
              Verify your email
            </h2>
            {error && (
              <p className="font-body-md text-body-md text-error text-center mb-xl">
                {error}
              </p>
            )}
            <p className="font-body-md text-body-md text-on-surface-variant text-center mb-xl max-w-85">
              We've sent a 6-digit code to your email address. Please enter it
              below to continue.
            </p>
            {/* <!-- Input Fields Area --> */}
            <form
              className="w-full flex flex-col items-center"
              id="verification-form"
              onSubmit={handleSubmit}
            >
              <div className="flex gap-sm sm:gap-md justify-center w-full mb-xl">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRef.current[index] = el;
                    }} // Assign the input element to the ref array
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-headline-sm font-bold border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-surface-container-lowest text-on-surface"
                  />
                ))}
              </div>
              {error && (
                <p className="font-body-sm text-red-500 text-error mb-xl">
                  {error}
                </p>
              )}
              {/* <!-- Timer & Resend --> */}
              <div className="flex flex-col items-center gap-xs mb-xl w-full">
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span id="countdown" className="text-error">
                    {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </span>
                </span>
                <button
                  className="font-label-md disabled:opacity-50 disabled:cursor-not-allowed text-label-md transition-colors text-primary hover:underline cursor-pointer"
                  id="resend-btn"
                  type="button"
                  disabled={!resend}
                  onClick={handleResend}
                >
                  Resend Code
                </button>
              </div>
              {/* <!-- Primary Action --> */}
              <button
                className="w-full cursor-pointer hover:scale-102  transition-all py-3 px-lg bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-surface-tint duration-200 shadow-level-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center gap-sm"
                type="submit"
              >
                <span className="">Verify Account</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </form>
          </div>
          {/* <!-- Footer Link --> */}
          <div className="mt-lg text-center">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4"
              href="#"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
