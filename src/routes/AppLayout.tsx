// src/routes/AppLayout.tsx
import { Outlet, useLocation} from 'react-router-dom'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'
import { AppSidebar } from '../components/app-sidebar'
import { Separator } from '../components/ui/separator'

export default function AppLayout() {
  const routeTitles: Record<string, string> = {
  "/licenses": "Licenses",
  "/my-licenses": "My Licenses",
  "/requests": "My License Requests",
  "/admin-requests": "License Requests",
}
const location = useLocation()
const pageTitle = routeTitles[location.pathname] || ""
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
