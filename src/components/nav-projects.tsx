import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import clsx from "clsx"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { pathname } = useLocation()
  const { open } = useSidebar()

  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarMenu>
          {projects.map((item) => {
            const isActive = pathname === item.url
            const buttonContent = (
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-black text-secondary font-semibold"
                      : "hover:bg-black hover:text-secondary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {open && <span className="truncate">{item.name}</span>}
                </Link>
              </SidebarMenuButton>
            )

            return (
              <SidebarMenuItem key={item.name}>
                {!open ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  buttonContent
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  )
}
