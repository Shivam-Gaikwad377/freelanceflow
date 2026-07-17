// services/dashboard.ts
import axios from "axios";
import { IProject } from "@/schemas/project.schema";
import ApiResponse from "@/types/ApiResponse";

export async function getActiveProjects(signal?: AbortSignal) {
  const { data } = await axios.get<ApiResponse>("/api/projects", {
    params: { status: "in progress" },
    signal,
  });
  return data;
}

export async function getTotalClients(signal?: AbortSignal) {
  const { data } = await axios.get<ApiResponse>("/api/Clients", {
    params: { status: "active" },
    signal,
  });
  return data;
}

export async function getInvoiceStats(signal?: AbortSignal) {
  const { data } = await axios.get<ApiResponse>("/api/Invoices/stats", { signal });
  return data;
}