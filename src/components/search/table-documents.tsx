import { useState } from "react";
import { Card} from "../ui/card";
import Image from "next/image";
import { formatDate } from "../utils/FormattedDate";
import { IoCalendarOutline } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import Link from "next/link";
import { Button } from "../ui/button";


interface DocumentData {
  id:number;
  title: string;
  entry_date: string;
  author_names: string;
  type_document: string;
  type_document_name: string;
  identifier: string;
}

interface TableDocumentsProps {
  data: DocumentData[];
}

export default function TableDocuments({ data }: TableDocumentsProps) {
  const itemsPerPage = 4; // Número de tarjetas por página
  const [currentPage, setCurrentPage] = useState(1); // Página en la que inicia 1

  /* Calcula el número total de páginas */
  const totalPages = Math.ceil(data.length / itemsPerPage);

  /* Se obtienen las tarjetas para la página actual */
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* Funciones de los botones para cambiar de página */
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-full w-full">
      {/* Contenido del grid */}
      <div className="row-start-1 gap-4 h-3/4 overflow-y">
        {currentItems.map((doc, index) => (
          <Link key={index} href={`document-profile/${doc.id}`}>
            <Card className="h-40 grid grid-cols-4 grid-rows-3 hover:bg-zinc-200">
              <div className="col-end-1 mr-2">
                <Image
                  src="/inacap-marca-agua.webp"
                  width={158}
                  height={158}
                  alt="Imagen del Documento"
                  className="p-4"
                />
              </div>
              <div className="flex col-end-4 col-start-1 row-span-1 row-end-2 mt-2 text-zinc-500 gap-4">
                <div className="w-fit h-fit bg-red-700 px-4 py-1 rounded-md text-xs text-white">
                  {doc.type_document_name}
                </div>
                <div className="flex gap-1 mt-1 text-sm">
                  <IoCalendarOutline size={17} />
                  Disponible: {formatDate(doc.entry_date)}
                </div>
              </div>
              <div className="col-end-4 col-start-1 row-span-1 row-end-3 text-xl font-medium">
                {doc.title}
              </div>
              <div className="col-end-4 col-start-1 row-span-1 mt-4 row-start-3 flex gap-1 text-md text-zinc-500 text-sm">
                <PiStudentFill size={20} />
                {doc.author_names.split(",").join(", ")}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Espacio entre contenido y paginación para ajustarse al tamaño disponible */}
      <div className="row-start-2"></div>

      {/* Botones de Paginación */}
      <div className="row-start-3 flex items-center justify-center space-x-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded-full disabled:opacity-50 bg-red-700 hover:bg-red-600"
        >
          <GoChevronLeft/>
        </Button>
        <span className="px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="rounded-full disabled:opacity-50 bg-red-700 hover:bg-red-600"
        >
          <GoChevronRight/>
        </Button>
      </div>
    </div>
  );
}
