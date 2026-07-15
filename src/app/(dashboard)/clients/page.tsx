"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClientCard from "@/components/Client/ClientCard";
import AddClient from "@/components/Client/AddCLient";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import useDebounce from "@/app/hooks/useDebounce";
import useFetch from "@/app/hooks/useFetch";
import { IClient } from "@/schemas/createClient.schema";
import PrimaryButton from "@/components/PrimaryButton";

const Page = () => {
  const session = useSession();
  const [clients, setClients] = useState<IClient[]>([]);
  const [clientOffset, setClientOffset] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const limit = 9;
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, loading, error } = useFetch(`/api/Clients`, {
    offset: clientOffset,
    limit,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: debouncedSearchTerm || undefined,
  });

  // Use another useEffect ONLY to sync the fetched data to your local state
  useEffect(() => {
    if (data) {
      setClients(data?.clients || []);
      setTotalClients(data?.total || 0);
    }
  }, [data]);
  
  const router = useRouter();
  const handleClick = (id: string) => {
    router.replace(`/clients/${id}`);
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/Clients/${id}`);
      if (response.data.success) {
        toast.success("Client deleted successfully");
        // Remove the deleted client from the local state
        setClients((prevClients) =>
          prevClients.filter((client) => client._id.toString() !== id)
        );
        // Update the total clients count
        setTotalClients((prevTotal) => prevTotal - 1);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };
  const [AddClientOpen, setAddClientOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col flex-1 md:p-gutter gap-2">
      {/* Header */}
      <div className={`${AddClientOpen ? " " : "hidden"}`}>
        <AddClient
          open={AddClientOpen}
          onClose={() => setAddClientOpen(false)}
        />
      </div>
      <div className={`${AddClientOpen ? "hidden" : ""} `}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-xl">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
              Clients
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Manage your active and archived client relationships.
            </p>
          </div>
          <PrimaryButton
            label=" New Client"
            onClick={() => setAddClientOpen(true)}
            icon="person_add"
          />
        </div>
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-md mb-lg">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant transition-all outline-none"
              placeholder="Search clients by name..."
              type="text"
            />
          </div>
          <div className="relative min-w-50">
            <select
              onChange={(e) => {
                setSelectedStatus(e.target.value);
              }}
              className="w-full pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface appearance-none outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
        {/* Client List (Bento Grid Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {clients.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                search_off
              </span>
              <p className="font-body-lg text-body-lg text-on-surface">
                No clients found
              </p>
             
            </div>
          ) : (
            clients.map((client) => (
             
                <ClientCard
                  key={client?._id.toString()}
                  name={client?.name}
                  status={client?.status}
                  phone={client?.phone}
                  email={client?.email}
                  totalBilled={client?.totalBilled?.toLocaleString("en-US", {
                      style: "currency",
                      currency:  "USD",
                    })}
                    onClick={() => handleClick(client._id.toString())}
                    onDelete={() => handleDelete(client._id.toString())}
                />
              
            ))
          )}
        </div>
        <div className="p-4">
          <Pagination
            total={totalClients}
            limit={limit}
            offset={clientOffset}
            onPageChange={(newOffset) => setClientOffset(newOffset)}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
