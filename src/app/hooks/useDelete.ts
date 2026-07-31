// hooks/useDelete.ts
import { useState } from "react";
import axios from "axios";
import {toast} from "sonner"; 

interface UseDeleteOptions<T extends { _id: any }> {
  resource: string; // e.g. "projects", "clients", "invoices"
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  successMessage?: string;
  errorMessage?: string;
}

export function useDelete<T extends { _id: any }>({
  resource,
  setItems,
  successMessage,
  errorMessage,
}: UseDeleteOptions<T>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteItem = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(`/api/${resource}/${id}`);
      if (response.data.success) {
        toast.success(successMessage ?? "Deleted successfully");
        setItems((prev) => prev.filter((item) => item._id.toString() !== id));
      }
    } catch (error) {
      console.error(`Error deleting ${resource}:`, error);
      toast.error(errorMessage ?? "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return { deleteItem, deletingId, isDeleting: deletingId !== null };
}