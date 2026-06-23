import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/TopNavbar'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
      
    </div>
  )
}