"use client";

import { useEffect, useState } from "react";
import { useGetAreasQuery } from "@/redux/features/apiAcademic";
import { useGetTypeDocumentsQuery } from "@/redux/features/apiDocument";

export default function Filters({
  getFilterResults,
}: {
  getFilterResults: (filters: { area: string; type: string, publisher: string }) => void;
}) {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("")

  const { data: areas } = useGetAreasQuery();
  const { data: types } = useGetTypeDocumentsQuery();

  // Actualizar los filtros seleccionados en el componente padre
  useEffect(() => {
    console.log("Filters Updated:", { selectedArea, selectedType, selectedPublisher });
    getFilterResults({ area: selectedArea, type: selectedType, publisher: selectedPublisher });
  }, [selectedArea, selectedType, selectedPublisher]);

  // Función para limpiar los filtros locales
  const clearFilters = () => {
    setSelectedArea(""); // Limpia el área seleccionada
    setSelectedType(""); // Limpia el tipo seleccionado
    setSelectedPublisher(""); // Limpia el publicador seleccionado
  };

  return (
    <div className="w-full h-full p-4 bg-neutral-100 rounded-md shadow-md">
      {/* Sección de Filtros por Área */}
      <div className="mb-4">
        <p className="font-semibold">Área</p>
        <div className="flex flex-wrap gap-2">
          {areas?.map((area: any, index) => (
            <button
              key={index}
              className={`px-4 py-2 m-1 rounded border text-sm hover:bg-zinc-200 ${
                selectedArea === area.id.toString()
                  ? "bg-red-700 bg-opacity-70 text-white" // Estilo para seleccionados
                  : "bg-white text-gray-700 border-gray-300" // Estilo para no seleccionados
              }`}
              onClick={() => setSelectedArea(area.id.toString())}
            >
              {area.area_name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sección de Filtros por Tipo de Documento */}
      <div className="mb-4">
        <p className="font-semibold">Tipo de Documento</p>
        <div className="flex flex-wrap gap-2">
          {types?.map((type: any, index) => (
            <button
              key={index}
              className={`px-4 py-2 m-1 rounded border text-sm hover:bg-zinc-200 ${
                selectedType === type.id.toString()
                  ? "bg-red-700 bg-opacity-70  text-white" // Estilo para seleccionados
                  : "bg-white text-gray-700 border-gray-300" // Estilo para no seleccionados
              }`}
              onClick={() => setSelectedType(type.id.toString())}
            >
              {type.type_name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Publicador</p>
        <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 m-1 rounded border text-sm hover:bg-zinc-200 ${
                selectedPublisher === "1"
                  ? "bg-red-700 bg-opacity-70  text-white" // Estilo para seleccionados
                  : "bg-white text-gray-700 border-gray-300" // Estilo para no seleccionados
              }`}
              onClick={() => setSelectedPublisher("1")}
            >
              Universidad Inacap
            </button>
            <button
              className={`px-4 py-2 m-1 rounded border text-sm hover:bg-zinc-200 ${
                selectedPublisher === "2"
                  ? "bg-red-700 bg-opacity-70  text-white" // Estilo para seleccionados
                  : "bg-white text-gray-700 border-gray-300" // Estilo para no seleccionados
              }`}
              onClick={() => setSelectedPublisher("2")}
            >
              Instituto Profesional Inacap
            </button>
            <button
              className={`px-4 py-2 m-1 rounded border text-sm hover:bg-zinc-200 ${
                selectedPublisher === "3"
                  ? "bg-red-700 bg-opacity-70  text-white" // Estilo para seleccionados
                  : "bg-white text-gray-700 border-gray-300" // Estilo para no seleccionados
              }`}
              onClick={() => setSelectedPublisher("3")}
            >
              Centro de Formación Técnica Inacap
            </button>
        </div>
      </div>

      {/* Limpiar Filtros */}
      <button
        className="px-4 py-2 mt-4 w-full text-sm bg-red-700 text-white rounded shadow hover:bg-red-600"
        onClick={clearFilters}
      >
        Limpiar Filtros
      </button>
    </div>
  );
}
