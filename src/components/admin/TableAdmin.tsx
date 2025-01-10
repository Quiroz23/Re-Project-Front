import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilIcon } from "@heroicons/react/20/solid";
import ModalAdmin from "./ModalAdmin";
import { useDisclosure } from "@nextui-org/react";
import EditFormAdmin from "./EditFormAdmin";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => ReactNode;
}

interface Props<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  title: string;
  method: "typeDocument" | "area";
  refetch: () => void; // Nueva prop para refetch
}

interface Identifiable {
  id: number;
}


export default function TableAdmin<T extends Identifiable>({
  data,
  columns,
  title,
  method,
  refetch, // Desestructuramos refetch
}: Props<T>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (id: number) => {
    setSelectedResourceId(id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedResourceId(null);
    setIsEditing(false);
    refetch();
  };

  return (
    <Card className="w-1/2">
      <CardHeader className="flex justify-between">
        <div className="flex justify-between px-2 py-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Button className="bg-green-700 hover:bg-green-600" onClick={onOpen}>
            Crear {title}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing && ( selectedResourceId && method === "typeDocument" || method === "area" ? (
          <EditFormAdmin
            method={method}
            id={selectedResourceId || 0}
            isEditing={isEditing}
            onCancel={handleCancelEdit} // Llamar refetch al cancelar
          />
      ): (
        <p>Error: Tipo de recurso no válido</p>
      ))}

        <Table>
          <TableHeader>
            <TableRow className="font-medium">
              {columns.map((column, index) => (
                <TableCell key={index}>{column.header}</TableCell>
              ))}
              <TableCell className="text-center">Funciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.render
                      ? column.render(item)
                      : String(item[column.key])}
                  </TableCell>
                ))}

                <TableCell>
                  <div className="gap-2 flex justify-center">
                    <Button
                      className="bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-2"
                      onClick={() => handleEditClick(item.id)}
                    >
                      <PencilIcon className="h-5 w-5" />
                      {title === "Areas" ? "Asignar" : "Editar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <ModalAdmin
        isOpen={isOpen}
        onClose={() => {
          onClose();
          refetch(); // Llamar a refetch al cerrar el modal
        }}
        method={method}
      />
    </Card>
  );
}