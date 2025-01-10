"use client";

import SearchBarInitial from "@/components/repository-intranet/search-initial";
import SliderArea from "@/components/repository-intranet/slider-area";
import Image from "next/image";

export default function RepositoryIntranet() {


  return (
    <main className="h-screen flex flex-col items-center gap-8 p-8">
      {/* Sección de búsqueda */}
      <section className="flex flex-col w-3/4 items-center p-8 rounded-xl bg-home-search shadow-md">
        <div className="w-full">
          <SearchBarInitial />
        </div>
      </section>

      {/* Sección de slider */}
      <section className="flex flex-col w-3/4 items-center p-8 rounded-xl bg-red-700 shadow-md">
        <p className="text-2xl mb-4 text-white font-semibold">
          Carreras que aportan en el crecimiento del conocimiento
        </p>
        <div className="max-w-full">
          <SliderArea />
        </div>
      </section>
    </main>
  );
}
