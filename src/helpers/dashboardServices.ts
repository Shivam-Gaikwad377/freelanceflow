import useFetch from "@/app/hooks/useFetch";
import { IProject } from "@/schemas/project.schema";

export const getActiveProjects = async () => {
  const { data, error } = useFetch<IProject[]>(`/api/projects`, {
    status: "in progress",
  });
  return {data, error};
}

export const getTotalClients = async () => {
  const { data, error } = useFetch<{ total: number }>(`/api/Clients`, {
    status: "active",
  });
  return { total: data.total, error };
};


export const getInvoiceStats = async () => {
  const { data, error } = useFetch(`/api/invoices/stats`);
  return { data, error };
}