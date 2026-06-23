"use client"
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/TopNavbar'
import AddProject from '@/components/AddProject'
import { useUiStore } from '@/store/useUiStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAddProjectOpen = useUiStore((state) => state.isAddProjectOpen);
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1"><div className={isAddProjectOpen ? "hidden" : " "}>{children}</div></main>
        <AddProject />
      </div>
      
    </div>
  )
}