"use client";

import React from "react";
import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import  Link from "next/link";
import ApiResponse from "@/types/ApiResponse";
const page = () => {
  const [timer, setTimer] = useState(5); // 5 minutes in seconds
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // Initialize an array of 6 empty strings
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code.");
      return;
    }
    try {
      const response: ApiResponse = await axios.post("/api/auth/reset-password", {
        email,
        verificationToken: enteredOtp,
        newPassword,
      });
      toast.success(response.data.message || "Password reset successfully");
      router.replace("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Invalid verification code. Please try again."
      );
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
  const handleResend = async () => {
    try {
      const response: ApiResponse = await axios.post("/api/auth/forgot-password", {
        email,
      });
      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Verification code resent successfully. Please check your email."
        );
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to resend verification code. Please try again."
      );

      return;
    }
  };
  return (
    <div className="antialiased  flex flex-col justify-center  min-h-screen relative  overflow-x-hidden">
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
        <div className="relative z-10 w-full max-w-110 px-margin-mobile">
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-xl shadow-ambient backdrop-blur-xl bg-opacity-95 flex flex-col gap-xl">
            <div className="text-center flex flex-col items-center">
              <h1 className="font-display text-headline-lg font-bold text-primary tracking-tight mb-md">
                FreelanceFlow
              </h1>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                Reset your password
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-70 mx-auto">
                Enter the 6-digit code sent to your email and set your new
                password.
              </p>
            </div>
            {/* <!-- Form Section --> */}
            <form className="flex flex-col gap-lg">
              {/* <!-- OTP Section --> */}
              <div className="flex flex-col gap-sm">
                <label className="font-label-md text-label-md text-on-surface">
                  OTP Code
                </label>
                <div
                  className="flex gap-unit justify-between"
                  id="otp-container"
                >
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
                <div className="flex justify-end mt-sm">
                  <button
                    type="button"
                    className="text-label-md font-label-md text-primary hover:text-primary-container transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
              {/* <!-- Passwords Section --> */}
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-sm relative">
                  <label
                    className="font-label-md text-label-md text-on-surface"
                    htmlFor="new-password"
                  >
                    New Password
                  </label>
                  <div className="relative w-full">
                    <input
                      className="w-full h-12 px-md pr-10 font-body-md text-body-md rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      id="new-password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-sm top-1/2 -translate-y-1/2 p-sm text-outline hover:text-primary transition-colors flex items-center justify-center"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        id="icon-new-password"
                      >
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-sm relative">
                  <label
                    className="font-label-md text-label-md text-on-surface"
                    htmlFor="confirm-password"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative w-full">
                    <input
                      className="w-full h-12 px-md pr-10 font-body-md text-body-md rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      id="confirm-password"
                      placeholder="••••••••"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {newPassword &&
                      confirmPassword &&
                      newPassword !== confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          Passwords do not match.
                        </p>
                      )}
                    <button
                      className="absolute right-sm top-1/2 -translate-y-1/2 p-sm text-outline hover:text-primary transition-colors flex items-center justify-center"
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        id="icon-confirm-password"
                      >
                        {showConfirmPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* <!-- Actions --> */}
              <div className="mt-sm flex flex-col gap-lg">
                <button
                  className="w-full h-12 rounded bg-linear-to-r from-primary to-surface-tint text-on-primary font-label-md text-label-md shadow-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center"
                  type="submit"
                >
                  Reset Password
                </button>
                <Link
                  className="text-center font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
                  href="/forgot-password"
                >
                  Back to Change Email
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
