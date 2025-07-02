import * as React from "react";
import { FileText, KeyRound, RollerCoaster } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";

const getProjectsByRole = (role: "admin" | "user") => {
  const common = [{ name: "Licenses", url: "/licenses", icon: KeyRound }];

  const userProjects = [
    // { name: "My Licenses", url: "/my-licenses", icon: BadgeCheck },
    { name: "Requests", url: "/requests", icon: FileText },
  ];

  const adminProjects = [
    { name: "Requests", url: "/admin-requests", icon: FileText },
  ];

  return role === "admin"
    ? [...common, ...adminProjects]
    : [...common, ...userProjects];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useAuthStore((state) => state.role);
  const projects = getProjectsByRole(role);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <RollerCoaster className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Licensify</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
