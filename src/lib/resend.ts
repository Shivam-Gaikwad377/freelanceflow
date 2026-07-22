import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
export const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not defined in environment variables.");
  }
  return new Resend(apiKey);
};


