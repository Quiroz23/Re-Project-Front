"use client";
import { Button, Spinner } from "@nextui-org/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetApplicationFormValidQuery,
  useGetPublicDocumentQuery,
  useGetApplicationFormPendingQuery,
} from "@/redux/features/apiDocument";
import { BookOpen, Eye } from "lucide-react"; // Ejemplo de íconos para representar las acciones
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useDisclosure } from "@nextui-org/react";
import ApplicationFormModal from "../common/ApplicationFormModal";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface InfoDocProps {
  id: number; // id_document
  role: string; // role user
  idUser: number; // id_user
}

export default function InfoDoc({ id, role, idUser }: InfoDocProps) {
  const { data: document, isLoading, isError } = useGetPublicDocumentQuery(id); // Obtiene la data del Document Solicitado
  const { data: applicationForm } = useGetApplicationFormValidQuery({
    document_id: id,
    student_id: idUser,
  }); // Obtiene un ApplicationForm válido
  const { data: applicationFormPending, refetch } =
    useGetApplicationFormPendingQuery({ document_id: id, student_id: idUser }); // Obtiene un ApplicationForm válido
  const { data: user } = useRetrieveUserQuery(); // Obtiene la data del usuario actual
  const { isOpen, onOpen, onClose } = useDisclosure(); // Funcionamiento del Modal
  const router = useRouter(); // Uso del router para las url
  const isStudent = role === "Estudiante"; // Constante de Estudiante

  /* Función de validación de acceso a la visualización del documento */
  const isStudentSection = () => {
    if (isStudent && user?.profile?.section === null) {
      if (applicationForm) {
        toast.success(
          `Tienes una solicitud disponible hasta el ${new Date(
            applicationForm.expiration_date
          ).toLocaleString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}!`
        );
        setTimeout(() => {
          router.push(`/repository-intranet/view-document/${id}`);
        }, 2000);
      } else if (applicationFormPending) {
        toast.info("Ya tiene una solicitud creada.\nEstá en revisión!");
      } else {
        toast.error(
          "No tienes una solicitud disponible.\nDebes crear una solicitud!"
        );
        onOpen();
      }
      return;
    }
    redirectToVisualization();
  };

  useEffect(() => {
    console.log("isOpen cambió a:", isOpen);
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center my-8 gap-2">
        <Spinner color="danger" />
        <p className="animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full justify-center items-center my-8 gap-2">
        <p className="animate-pulse">
          Error al cargar información del Documento.
        </p>
      </div>
    );
  }

  /* Redireccionamiento para la visualización del Documento */
  const redirectToVisualization = () => {
    if (document?.id && user?.profile?.id) {
      setTimeout(() => {
        router.push(`/repository-intranet/view-document/${id}`);
      }, 2000);
    } else {
      console.error("Faltan datos para document o student");
    }
  };

  // Determinar estado para ícono, título y descripción
  const canView = !isStudent || user?.profile?.section || applicationForm;

  const icon = canView ? (
    <Eye className="w-5 h-5" />
  ) : (
    <BookOpen className="w-5 h-5" />
  );

  const iconClasses = `w-8 h-8 rounded-full flex items-center justify-center ${
    canView ? "bg-green-600 text-white" : "bg-blue-600 text-white"
  }`;

  const title = canView
    ? "Acceso al Documento"
    : "Solicitar Lectura del Documento";

  const description = canView
    ? "Ver el contenido completo del documento."
    : "Solicita permiso para acceder al documento.";

  const buttonClasses = `w-full ${
    canView
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`;

  const buttonText = canView ? "Ver" : "Solicitar";

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Título y Autor */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Imagen a la izquierda */}
        <div className="w-full md:w-1/5">
          <Image
            src="/document.webp"
            width={240}
            height={240}
            alt="Imagen del Documento"
            className="border border-gray-100 shadow-lg"
          />
        </div>

        {/* Contenido a la derecha */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {/* Título y autores */}
          <div className="px-1">
            <h1 className="text-2xl font-bold mb-4">
              Repositorio Digital Privado “Re-Projects”
            </h1>
            <p className="mb-2">
              <span className="font-semibold">Autor(es):</span> Franco Garrido,
              Matías Zurita, Cristian Quiroz
            </p>
            <p>
              <span className="font-semibold">Profesor Guía:</span> Christopher
              Muñoz
            </p>
          </div>

          {/* Información y Académico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Card>
              <CardHeader className="font-semibold text-lg">Información</CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="font-semibold">Tipo de Acceso:</span> Acceso
                  abierto
                </p>
                <p>
                  <span className="font-semibold">Año de Publicación:</span>{" "}
                  2024
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="font-semibold text-lg">Académico</CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="font-semibold">Área:</span> Tecnologías de la
                  Información y Ciberseguridad
                </p>
                <p>
                  <span className="font-semibold">Carrera:</span> Ingeniería
                  Informática
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Resumen/Reseña */}
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-2">Resumen/Reseña</h2>
        <p className="text-justify text-gray-700 leading-relaxed">
          {document?.abstract}
        </p>
      </div>
      {/* Sección del botón para solicitar lectura */}
      <div>
        <Card className="p-6 shadow-lg rounded-lg bg-white border border-gray-200">
          <CardHeader className="flex items-center space-x-4">
            <div className={iconClasses}>{icon}</div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-gray-500">{description}</p>
            </div>
          </CardHeader>
          <CardContent>
            <Button className={buttonClasses} onClick={isStudentSection}>
              {buttonText}
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Modal para el formulario de solicitud */}
      {isOpen && (
        <ApplicationFormModal
          isOpen={isOpen}
          onClose={onClose}
          documentId={document?.id}
          studentId={user?.profile?.id}
          refetch={refetch}
        />
      )}
    </div>
  );
}
