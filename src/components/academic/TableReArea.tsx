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
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/20/solid";
import ModalListTableArea from "../common/ModalListTableArea";
import { useDisclosure } from "@nextui-org/react";
import EditAreaForm from "./EditFormArea";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => ReactNode;
}

interface Identifiable {
  id: number;
}

interface Props<T, R> {
  data: T[];
  columns: ColumnConfig<T>[];
  title: string;
  onDelete: (id: number) => void;
  relatedData?: R[];
  relatedTitle?: string;
  relatedColumns?: ColumnConfig<R>[];
  relatedFilterKey?: keyof R;
  onSuccess: ()=> void;
}

export default function TableReArea<
  T extends Identifiable,
  R extends Identifiable
>({
  data,
  columns,
  title,
  onDelete,
  relatedData = [],
  relatedTitle,
  relatedColumns,
  relatedFilterKey,
  onSuccess
}: Props<T, R>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredData, setFilteredData] = useState<R[]>([]);
  const [isEditing, setIsEditing] = useState(false); // Controla si se está editando
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(
    null
  ); // ID del recurso en edición

  const handleOpenModal = (relatedId: number) => {
    if (relatedData && relatedFilterKey) {
      const filtered = relatedData.filter(
        (item) => item[relatedFilterKey] === relatedId
      );
      setFilteredData(filtered);
      onOpen();
    }
  };

  const handleEditClick = (id: number) => {
    setSelectedResourceId(id); // Establece el ID del recurso que se editará
    setIsEditing(true); // Muestra el formulario
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Oculta el formulario
    setSelectedResourceId(null); // Limpia el recurso seleccionado
  };

  return (
    <>
      <div className="p-4">
        {/* Formulario de edición */}
        {isEditing &&
          selectedResourceId !== null &&
          (relatedFilterKey === "career" ||
          relatedFilterKey === "signature" ||
          relatedFilterKey === "section" ? (
            <EditAreaForm
              gestionProp={relatedFilterKey}
              resourceId={selectedResourceId}
              onCancel={handleCancelEdit}
              isEditing={isEditing}
              onSuccess={onSuccess}
            />
          ) : (
            <p>Error: Tipo de recurso no válido</p>
          ))}
      </div>

      {/* Tabla */}
      <Table className="text-center">
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow className="font-medium">
            {columns.map((column, index) => (
              <TableCell key={index}>{column.header}</TableCell>
            ))}
            <TableCell>Funciones</TableCell>
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
                  {/* Botón Editar */}
                  <Button
                    className="bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-2"
                    onClick={() => handleEditClick(item.id)} // Activa el formulario de edición
                  >
                    <PencilIcon className="h-5 w-5" />
                    Editar
                  </Button>

                  {/* Botón Eliminar */}
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => onDelete(item.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                    Eliminar
                  </Button>

                  {/* Opcional: Ver datos relacionados */}
                  {title === "Lista de Asignaturas" && (
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => handleOpenModal(item.id)}
                    >
                      <EyeIcon className="h-5 w-5" />
                      Ver Secciones
                    </Button>
                  )}
                  {title === "Lista de Carreras" && (
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => handleOpenModal(item.id)}
                    >
                      <EyeIcon className="h-5 w-5" />
                      Ver Asignaturas
                    </Button>
                  )}
                  {title === "Lista de Secciones" && (
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => handleOpenModal(item.id)}
                    >
                      <EyeIcon className="h-5 w-5" />
                      Ver Estudiantes
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para datos relacionados */}
      {relatedData && relatedColumns && relatedTitle && (
        <ModalListTableArea
          isOpen={isOpen}
          onClose={onClose}
          data={filteredData}
          columns={relatedColumns}
          title={relatedTitle}
        />
      )}
    </>
  );
}
