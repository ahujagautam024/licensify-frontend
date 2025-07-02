"use client"

import { User, LogOut } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { useNavigate } from "react-router-dom"

export function NavUser() {
  const email = useAuthStore((state) => state.email)
  const displayName = useAuthStore((state) => state.displayName)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering parent onClick
    logout()
    navigate("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <User />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{displayName}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
          {/* Only this triggers logout */}
          <LogOut
            className="cursor-pointer hover:text-red-500"
            onClick={handleLogout}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
