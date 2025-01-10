import { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

// Configuración de columnas genéricas
interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => ReactNode;
}

// Restricción para asegurar que T tenga un `id`
interface Identifiable {
  id: number;
}

// Props del componente reutilizable
interface ModalListTableProps<T extends Identifiable> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: ColumnConfig<T>[];
  title: string;
}

export default function ModalListTable<T extends Identifiable>({
  isOpen,
  onClose,
  data,
  columns,
  title,
}: ModalListTableProps<T>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {data.length > 0 ? (
            <Table className="w-full">
              <TableCaption>{title}</TableCaption>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={index}>{column.header}</TableCell>
                  ))}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500">
              No hay datos disponibles para mostrar.
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
