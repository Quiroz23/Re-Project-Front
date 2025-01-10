"use client";

import { useFetchDocumentQuery } from "@/redux/features/apiDocument";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import {
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosAdd,
  IoIosRemove,
} from "react-icons/io";

// Configuración del worker de PDF.js desde la CDN
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface ViewerPDFProps {
  id: number;
}

export default function ViewerPDF({ id }: ViewerPDFProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1.0); // Estado para controlar el zoom
  const pageRefs = useRef<HTMLDivElement[]>([]);

  const {
    data: documentBlob,
    error,
    isLoading,
  } = useFetchDocumentQuery(id);

  useEffect(() => {
    if (documentBlob) {
      const url = URL.createObjectURL(documentBlob);
      setDocumentUrl(url);

      return () => URL.revokeObjectURL(url); // Liberar URL del Blob
    }
  }, [documentBlob]);

  function onDocLoadSuccess({ numPages }: { numPages: number }) {
    setTotalPages(numPages);
  }

  const changePage = (direction: "prev" | "next") => {
    setPageNumber((prev) => {
      const newPageNumber =
        direction === "prev"
          ? Math.max(prev - 1, 1)
          : Math.min(prev + 1, totalPages);
      // Desplazarse a la página seleccionada
      pageRefs.current[newPageNumber - 1]?.scrollIntoView({
        behavior: "smooth",
      });
      return newPageNumber;
    });
  };

  // Funciones para cambiar el zoom
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0)); // Zoom máximo 2.0x
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5)); // Zoom mínimo 0.5x

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center my-8 gap-2">
        <Spinner color="danger" />
        <p className="animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (error || !documentUrl) {
    return <p>Error al cargar el documento</p>;
  }

  return (
    <div
      className="w-full h-screen flex select-none"
      style={{ userSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()} // Desactiva el clic derecho
    >
      {/* Sección de miniaturas */}
      <div className="border-r-2 border-white w-60 h-full">
        <div className="h-full overflow-y-auto bg-neutral-700 flex flex-col items-center">
          <Document file={documentUrl} onLoadSuccess={onDocLoadSuccess}>
            {Array.from(new Array(totalPages), (_, index) => (
              <div
                key={index}
                className={`cursor-pointer my-2 ${
                  pageNumber === index + 1
                    ? "border-4 border-red-700"
                    : "border"
                }`}
                onClick={() => {
                  setPageNumber(index + 1); // Actualiza el número de página
                  pageRefs.current[index]?.scrollIntoView({
                    behavior: "smooth", // Desplaza suavemente a la página seleccionada
                    block: "start",
                  });
                }}
              >
                <Page
                  pageNumber={index + 1}
                  height={100}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* Sección principal del documento con scroll, navegación y controles de zoom */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Controles de navegación y zoom */}
        <div className="bg-neutral-700 text-white h-16 flex items-center justify-center px-4 border-b">
          {/* Contenedor para centrar todos los botones */}
          <div className="flex items-center gap-4">
            {/* Botones de navegación de página */}
            <div className="flex items-center gap-2">
              <IoIosArrowBack
                className="cursor-pointer"
                onClick={() => changePage("prev")}
              />
              <div>
                {pageNumber} / {totalPages}
              </div>
              <IoIosArrowForward
                className="cursor-pointer"
                onClick={() => changePage("next")}
              />
            </div>

            {/* Botones de zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="bg-gray-500 p-2 rounded-full"
              >
                <IoIosRemove />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} className="bg-gray-500 p-2 rounded-full">
                <IoIosAdd />
              </button>
            </div>
          </div>
        </div>

        {/* Visualización del documento con zoom */}
        <div className="flex justify-center overflow-y-auto p-4 bg-neutral-800 h-screen">
          <Document file={documentUrl} onLoadSuccess={onDocLoadSuccess}>
            {Array.from(new Array(totalPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => {
                  if (el) pageRefs.current[index] = el;
                }}
                className="mb-2"
              >
                <Page
                  pageNumber={index + 1}
                  width={800 * zoom} // Ajusta el ancho según el valor de zoom
                  renderTextLayer={false} // Deshabilita la capa de texto
                  className={
                    pageNumber === index + 1 ? "border border-red-500" : ""
                  }
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
