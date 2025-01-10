"use client";

import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetDocumentQuery,
  usePatchDocumentAccessMutation,
  usePatchPublishFormMutation,
} from "@/redux/features/apiDocument";
import {
  useGetAreasQuery,
  useGetCareersQuery,
  useGetSignaturesQuery,
} from "@/redux/features/apiAcademic";
import { useGetTypeDocumentsQuery } from "@/redux/features/apiDocument";
import Link from "next/link";
import { File } from "lucide-react";

interface DocumentFormProps {
  context: number | any; // ID del documento que se está editando
  publishId: number | any;
  onClose: () => void;
}

export default function DocumentFormManage({
  context,
  publishId,
  onClose,
}: DocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeAccess, setTypeAccess] = useState<boolean | null>(null);

  // Consultas
  const { data: initialData, isLoading: isLoadingDocument } =
    useGetDocumentQuery(context);
  const { data: areas, isLoading: isLoadingAreas } = useGetAreasQuery();
  const { data: careers, isLoading: isLoadingCareers } = useGetCareersQuery();
  const { data: signatures, isLoading: isLoadingSignatures } =
    useGetSignaturesQuery();
  const { data: types, isLoading: isLoadingTypes } = useGetTypeDocumentsQuery();
  const [patchPublishForm] = usePatchPublishFormMutation();
  const [patchDocument] = usePatchDocumentAccessMutation();

  // Estado de carga combinado
  const isLoading = isLoadingDocument || isLoadingAreas || isLoadingTypes;

  // Mostrar spinner mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" />
        <p className="ml-2">Cargando datos...</p>
      </div>
    );
  }

  const onClick = (stateUpdate: string, typeAccessUpdate: boolean | null) => {
    if (!publishId || !stateUpdate) {
      toast.error("Faltan datos para completar la aprobación.");
      return;
    }

    if (typeAccessUpdate === null) {
      toast.error("Se debe seleccionar un Tipo de Acceso");
      return;
    }

    setIsSubmitting(true);

    patchDocument({
      id: context,
      type_access: typeAccessUpdate,
    })
      .unwrap()
      .then(() => {
        return patchPublishForm({
          id: publishId,
          state: stateUpdate,
        }).unwrap();
      })
      .then(() => {
        if (stateUpdate === "2") {
          toast.success(`Ha sido aprobado el documento ${initialData?.title}!`);
        } else {
          toast.error(`Ha sido rechazado el documento ${initialData?.title}!`);
        }

        onClose();
      })
      .catch((error: any) => {
        console.error("Error al aprobar el documento:", error);
        toast.error("Error al aprobar o rechazar el documento.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl p-4 text-center">
          Gestionar Acceso Documento Académico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Título */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título del documento"
              defaultValue={initialData?.title}
              readOnly
            />
          </div>

          {/* Resumen */}
          <div>
            <Label htmlFor="abstract">Resumen</Label>
            <Textarea
              id="abstract"
              placeholder="Resumen del documento"
              className="h-32"
              defaultValue={initialData?.abstract}
              readOnly
            />
          </div>

          {/* Calificación y Acceso */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 ">
              <Label htmlFor="qualification">Calificación</Label>
              <Input
                id="qualification"
                type="number"
                placeholder="Calificación"
                defaultValue={initialData?.qualification}
                readOnly
              />
            </div>
            {/* Tipo de Acceso */}
            <div className="flex items-center gap-2 w-fit">
              <Label htmlFor="type_access">Acceso</Label>
              <select
                id="type_access"
                className={`border p-2 rounded animate-pulse border-green-600 text-sm`} // Agrega un borde rojo si hay un error
                onChange={(e) =>
                  setTypeAccess(
                    e.target.value === "true"
                      ? true
                      : e.target.value === "false"
                      ? false
                      : null
                  )
                }
                value={typeAccess !== null ? typeAccess.toString() : ""}
              >
                <option value="" disabled>
                  ------
                </option>
                <option value="true">Público</option>
                <option value="false">Privado</option>
              </select>
            </div>
            {/* Publicador */}
            <div className="flex items-center gap-2 w-fit">
              <Label htmlFor="publisher">Publicador</Label>
              <select
                id="publisher"
                defaultValue={initialData?.publisher}
                className="border p-2 rounded w-full text-sm"
                disabled
              >
                <option value="1">Universidad Inacap</option>
                <option value="2">Instituto Profesional Inacap</option>
                <option value="3">Centro de Formación Técnica Inacap</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            {/* Área Académica */}
            <div className="flex items-center gap-2">
              <Label htmlFor="area">Área</Label>
              <select
                id="area"
                defaultValue={initialData?.area}
                className="border p-2 rounded w-full text-sm"
                disabled
              >
                {areas?.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.area_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Carrera */}
            <div className="flex items-center gap-2">
              <Label htmlFor="career">Carrera</Label>
              <select
                id="career"
                defaultValue={initialData?.career}
                disabled // Deshabilitado ya que está preseleccionado
                className="border p-2 rounded max-h-full text-sm"
              >
                {careers?.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.career_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-2">
              {/* Selector de Asignatura */}
              <div className="flex items-center gap-2 w-fit">
                <Label htmlFor="signature">Asignatura</Label>
                <select
                  id="signature"
                  defaultValue={initialData?.signature}
                  disabled // Deshabilitado ya que está preseleccionado
                  className="border p-2 rounded w-full text-sm"
                >
                  {signatures?.map((signature) => (
                    <option key={signature.id} value={signature.id}>
                      {signature.signature_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grado Académico */}
              <div className="flex items-center gap-2 w-fit">
                <Label htmlFor="academic_degree">Grado Académico</Label>
                <select
                  id="academic_degree"
                  defaultValue={initialData?.academic_degree}
                  className="border p-2 rounded w-80 text-sm"
                  disabled
                >
                  <option value="1">Técnico de Nivel Superior</option>
                  <option value="2">Ingeniero</option>
                  <option value="3">Licenciado</option>
                </select>
              </div>
            </div>

          {/* Documento */}
          <div className="flex justify-between gap-2">
            {/* Tipo de Documento */}
            <div className="flex items-center gap-2 w-fit">
              <Label htmlFor="type_document">Tipo de Documento</Label>
              <select
                id="type_document"
                defaultValue={initialData?.type_document}
                className="border p-2 rounded text-sm"
                disabled
              >
                {types?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 px-10">
              <Link
                href={`/repository-intranet/view-document/${initialData?.id}`}
                className="flex hover:text-green-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Documento
                <span>
                  <File />
                </span>
              </Link>
            </div>
          </div>

          {/* Botones de apruebo o rechazo */}
          <div className="w-full">
            <Button
              className="w-full bg-green-700 hover:bg-green-600 mt-4 p-5"
              type="submit"
              disabled={isSubmitting}
              onClick={() => onClick("2", typeAccess)}
            >
              {isSubmitting ? "Aprobando..." : "Aprobar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
