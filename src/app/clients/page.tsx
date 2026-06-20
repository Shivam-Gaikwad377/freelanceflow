"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClientCard from "@/components/ClientCard";
import AddClient from "@/components/AddCLient";
import Pagination from "@/components/Pagination";
import { set } from "mongoose";

const page = () => {
  const session = useSession();
  const [clients, setClients] = useState<any[]>([]);
  const [clientOffset, setClientOffset] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const limit = 9;
  useEffect(() => {
    const fetchClients = async () => {
      if (session) {
        try {
          const response = await axios.get(`/api/Clients?offset=${clientOffset}&limit=${limit}`);
          const fetchedClients = Array.isArray(response.data.data.clients)
            ? response.data.data.clients
            : Array.isArray(response.data.data.clients)
              ? response.data.data.clients
              : [];
          console.log("Fetched clients:", fetchedClients);

          setClients(fetchedClients);
          setTotalClients(response.data.data.total);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      }
    };

    fetchClients();
  }, [clientOffset, limit]);
  const router = useRouter();
  const handleClick = (id: string) => {
    router.replace(`/clients/${id}`);
  };
  const [AddClientOpen, setAddClientOpen] = useState<boolean>(false);

  return (
    <div>
      <Sidebar />

      <div className=" flex w-auto flex-col flex-1 max-w-full ml-64  md:px-gutter gap-2">
        <TopNavbar />
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
            <button
              onClick={() => setAddClientOpen(true)}
              className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                person_add
              </span>
              Add Client
            </button>
          </div>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-md mb-lg">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant transition-all outline-none"
                placeholder="Search clients by name..."
                type="text"
              />
            </div>
            <div className="relative min-w-[200px]">
              <select className="w-full pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface appearance-none outline-none cursor-pointer">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          {/* Client List (Bento Grid Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {clients?.map((client) => (
              <div onClick={() => handleClick(client?._id)}>
                <ClientCard
                  key={client?._id}
                  name={client?.name}
                  status={client?.status}
                  phone={client?.phone}
                  email={client?.email}
                  totalBilled={client?.totalBilled}
                />
              </div>
            ))}
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
      {/* <!-- BottomNavBar (Mobile Only) --> */}
      <nav className="md:hidden flex justify-around items-center w-full px-lg py-sm bg-surface-container-lowest border-t border-outline-variant fixed bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <a
          className="flex flex-col items-center gap-1 p-2 text-on-surface-variant"
          href="#"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-sm text-[10px]">Dashboard</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 p-2 text-primary font-bold"
          href="#"
        >
          <span className="material-symbols-outlined icon-fill">group</span>
          <span className="font-label-sm text-[10px]">Clients</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 p-2 text-on-surface-variant"
          href="#"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-label-sm text-[10px]">Invoices</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 p-2 text-on-surface-variant"
          href="#"
        >
          <span className="material-symbols-outlined">folder_open</span>
          <span className="font-label-sm text-[10px]">Projects</span>
        </a>
      </nav>
      {/* <!-- Add Client Drawer/Overlay --> */}
    </div>
  );
};

export default page;
