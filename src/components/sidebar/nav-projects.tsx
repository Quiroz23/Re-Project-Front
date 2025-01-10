"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { IconType } from "react-icons";

interface Project {
  name: string;
  path: string;
  icon: IconType;
}

export function NavProjects({ projects }: { projects: Project[] }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu className="gap-2">
      {projects.map((item) => (
        <SidebarMenuItem key={item.name} className="px-2">
          <Link href={item.path} className="flex items-center space-x-2">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-red-700 hover:text-white"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <item.icon className="text-xl" />
                {/* Renderiza siempre el ícono */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span>{item.name}</span>
              </div>
              {/* Muestra el texto solo si no está colapsado */}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
