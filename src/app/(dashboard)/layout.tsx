"use client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/TopNavbar";
import AddProject from "@/components/Project/AddProject";
import { useUiStore } from "@/store/useUiStore";
import AddInvoice from "@/components/Invoice/AddInvoice";
import TimerHydrator from "@/components/TimeHydrator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAnyModalOpen = useUiStore((state) => state.activeModal !== null);

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <Topbar />
        <main className="flex-1">
          <div className={isAnyModalOpen ? "hidden" : ""}>{children}</div>
        </main>
        <AddInvoice />
        <AddProject />
        <TimerHydrator />
      </div>
    </div>
  );
}