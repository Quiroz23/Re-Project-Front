import { UserRole } from './userRoles';
import {
  FaBook,
  FaChalkboardTeacher,
  FaBookReader,
  FaFileUpload,
  FaSearch,
  FaUserPlus,
  FaChartBar,
  FaUserFriends,
  FaHistory
} from 'react-icons/fa';
import { IoIosDocument } from "react-icons/io";
import { HiAcademicCap } from "react-icons/hi";
import { FiUserPlus } from "react-icons/fi";
import { GrDocumentUpdate } from "react-icons/gr";
import { IconType } from 'react-icons';

interface SidebarLink {
  name: string;
  path: string;
  icon: IconType;
}

// Función que genera enlaces dinámicamente según rol y condiciones
export const getSidebarLinks = (userRole: UserRole, hasSectionAssigned: boolean): SidebarLink[] => {
  switch (userRole) {
    case UserRole.Estudiante:
      return [
        { name: 'Buscador', path: '/repository-intranet/search', icon: FaSearch },
        ...(hasSectionAssigned ? [] : [{ name: 'Solicitudes Realizadas', path: '/repository-intranet/application-form-list', icon: FaHistory }]),
      ];
    case UserRole.Profesor:
      return [
        { name: 'Buscador', path: '/repository-intranet/search', icon: FaSearch },
      ];
    case UserRole.ProfesorGuía:
      return [
        { name: 'Buscador', path: '/repository-intranet/search', icon: FaSearch },
        { name: 'Estadisticas', path: '/repository-intranet/statistics-teacher', icon: FaChartBar },
        { name: 'Publicar Documento', path: '/repository-intranet/publish-document', icon: FaFileUpload },
        { name: 'Lista de Publicaciones', path: '/repository-intranet/publish-document/document-list', icon: FaBook },
        { name: 'Registrar Estudiante', path: '/repository-intranet/manage-student', icon: FaUserPlus },
        { name: 'Registrar Estudiante Invitado', path: '/repository-intranet/manage-user', icon: FiUserPlus },
      ];
    case UserRole.Director:
      return [
        { name: 'Buscador', path: '/repository-intranet/search', icon: FaSearch },
        { name: 'Estadisticas', path: '/repository-intranet/statistics', icon: FaChartBar },
        { name: 'Gestionar Area', path: '/repository-intranet/manage-academic', icon: FaChalkboardTeacher },
        { name: 'Solicitudes de Documentos', path: '/repository-intranet/manage-requests/document', icon: GrDocumentUpdate },
        { name: 'Solicitudes de Visualización', path: '/repository-intranet/manage-requests/visualization', icon: FaBookReader },
        { name: 'Registrar Profesor', path: '/repository-intranet/manage-user', icon: FaUserPlus },
        { name: 'Publicar Documento Antiguo', path: '/repository-intranet/publish-old-document', icon: GrDocumentUpdate },
      ];
    case UserRole.Administrador:
      return [
        { name: 'Gestionar Área', path: '/repository-intranet/create-area', icon: HiAcademicCap },
        { name: 'Gestionar Tipo de Documento', path: '/repository-intranet/create-type-document', icon: IoIosDocument },
        { name: 'Registrar Director Académico', path: '/repository-intranet/create-director', icon: FaUserFriends },
      ];
    default:
      return [];
  }
};
