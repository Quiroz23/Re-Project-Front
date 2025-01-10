"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/redux/features/authApiSlice";// Importar el hook personalizado que maneja el estado del formulario y la lógica
import { logout as logOut } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { FaUserCircle, FaUserGraduate } from "react-icons/fa"; // Usuario normal y estudiante
import { RiAdminFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa6"; // Usuario Director de Carrera 
import { clearUser } from "@/redux/features/userSlice";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user:{
    name:string;
    first_name:string;
    email:string;
    rol:string;
  },
}) {
  const { isMobile } = useSidebar();
  const [ logout ] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const rol_actual = user.rol as Role;
  type Role =  'Estudiante' | 'Profesor' | 'Profesor Guía' | 'Director de Carrera' | 'Administrador';

  const getIconByRole = (role: Role) => {
    switch (role) {
      case 'Estudiante':
        return <FaUserGraduate size={28}/>; 
      case 'Profesor':
        return <FaUserCircle size={28} />;    
      case 'Profesor Guía':
        return <FaUserCircle size={28}/>; 
      case 'Director de Carrera':
          return <FaUserTie size={28}/>;   
      case 'Administrador':
          return <RiAdminFill size={28}/>;  
      default:
        return <FaUserCircle size={28}/>;
    }
  };

  const icono = getIconByRole(rol_actual)

  const handleLogout = async () => {
    try {
      // Realiza el logout en el servidor
      await logout(undefined).unwrap();

      // Despacha las acciones para limpiar el estado en Redux
      dispatch(logOut());
      dispatch(clearUser());

      toast.success(`¡Hasta la próxima ${user.first_name}!`);
      window.location.reload();
    } catch (error) {
      toast.error("¡Falló el cierre de sesión!");
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground active:bg-transparent"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                  {icono}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                  {user.name}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {icono}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.rol}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <Link href={`/repository-intranet/password`}>
                  <DropdownMenuItem>
                    
                      <BadgeCheck />
                      Perfil
                    
                  </DropdownMenuItem>
                </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut/>
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
