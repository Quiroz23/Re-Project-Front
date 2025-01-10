import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetAreasQuery } from "@/redux/features/apiAcademic";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import Link from "next/link";
import { FaUniversity, FaBook, FaChalkboardTeacher } from "react-icons/fa"; // Importación de íconos

export default function CardArea() {
  const { data: areas = [] } = useGetAreasQuery();
  const { data: user } = useRetrieveUserQuery();

  // Filtrar áreas asignadas al usuario
  const userAreas = areas.filter((area) => area.director === user?.id);

  return (
    <div className="flex flex-col items-center gap-8">
      {userAreas.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-8 ">
          {userAreas.map((area) => (
            <div key={area.id} className="sm:w-auto max-w-md">
              <Card className="shadow-md shadow-red-700">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-medium">
                    {area.area_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center flex-col gap-8">
                  <Link
                    href={`/repository-intranet/manage-academic/career/${area.id}`}
                  >
                    <Button className="w-60 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-500">
                      <FaUniversity className="text-lg" />
                      Gestión de Carreras
                    </Button>
                  </Link>
                  <Link
                    href={`/repository-intranet/manage-academic/signature/${area.id}`}
                  >
                    <Button className="w-60 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-500">
                      <FaBook className="text-lg" />
                      Gestión de Asignaturas
                    </Button>
                  </Link>
                  <Link
                    href={`/repository-intranet/manage-academic/section/${area.id}`}
                  >
                    <Button className="w-60 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-500">
                      <FaChalkboardTeacher className="text-lg" />
                      Gestión de Secciones
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay áreas registradas para ti</p>
      )}
    </div>
  );
}
