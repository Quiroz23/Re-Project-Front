"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { UserRole } from "@/lib/userRoles";
import { getSidebarLinks } from "@/lib/sideBarRedirect";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  if (isLoading || isFetching) return <p>Cargando sidebar...</p>;

  const full_name = `${user?.profile?.first_name} ${user?.profile?.last_name}`;
  const first_name = user?.profile?.first_name;
  const email = user?.email;
  const group = user?.group?.name;
  const hasSectionAssigned = !!user?.profile?.section; // Determina si el estudiante tiene sección asignada

  const links = getSidebarLinks(user?.group?.name as UserRole, hasSectionAssigned);

  /* Configuración de la data del sidebar */
  const data = {
    user: {
      name: full_name || "",
      first_name: first_name || "",
      email: email || "",
      rol: group || "",
    },
    home: [
      {
        name: "RE-PROJECTS",
        logo: GalleryVerticalEnd,
        plan: "Repositorio digital Inacap Chillán",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-6">
        <TeamSwitcher teams={data.home} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={links} /> {/* Pasamos `links` como `projects` */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
