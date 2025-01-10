import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem } from "@nextui-org/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGroup from "@/hooks/use-group";
import { useGetUsersQuery } from "@/redux/features/apiUser";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useGetSectionsTeacherQuery } from "@/redux/features/apiAcademic";

interface GroupFormProps {
  onGroupSelect: (id: number | null) => void;
  method?: string;
}

export default function GroupForm({ onGroupSelect, method }: GroupFormProps) {
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();
  const { data: user } = useRetrieveUserQuery();
  const { data: sections } = useGetSectionsTeacherQuery({
    teacherId: user?.id || 0,
  });

  const {
    onChange,
    onSubmit,
    isLoading: isGroupLoading,
    formData,
    errors,
  } = useGroup(onGroupSelect);

  // Filtrar usuarios que son profesores o profesores guías
  const teachers =
    users?.filter(
      (user) =>
        user.group?.name === "Profesor" || user.group?.name === "Profesor Guía"
    ) || [];

  return (
    <Card>
      <CardHeader className="mx-auto max-w-md">
        <CardTitle className="text-2xl text-center">Agregar un grupo</CardTitle>
        <CardDescription>
          Crea un grupo para añadir a los autores del documento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          {/* Input para el nombre del grupo */}
          <div>
            <Label htmlFor="group_name">Nombre del Grupo de trabajo</Label>
            <Input
              name="group_name"
              id="group_name"
              type="text"
              value={formData.group_name}
              onChange={onChange}
              disabled={isGroupLoading}
            />
            {errors.group_name && (
              <p className="text-red-500 mt-1">{errors.group_name}</p>
            )}
          </div>

          {user?.group?.name === "Profesor Guía" && (
          <div className="pt-4">
            <Label htmlFor="section">Sección</Label>
            <Select
              id="section"
              placeholder="Selecciona una sección"
              disabled={isUsersLoading || isGroupLoading}
              fullWidth
              onChange={(event) => {
                const value = event.target.value; // Extraer el valor seleccionado
                const sectionId = parseInt(value, 10); // Convertir a número
                onChange({
                  target: { name: "section", value: sectionId },
                });
              }}
            >
              {(sections || []).map((section) => (
                <SelectItem key={section.id} value={String(section.id)}>
                  <span>ID: {section.id} | {section.section_name}</span>
                </SelectItem>
              ))}
            </Select>
            {!sections?.length && (
              <p className="text-red-500 mt-2">
                No hay secciones disponibles para seleccionar.
              </p>
            )}
          </div>
          )}

          {/* Botón para crear grupo */}
          <Button type="submit" disabled={isGroupLoading} className="mt-4">
            {isGroupLoading ? "Creando..." : "Crear grupo de trabajo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
