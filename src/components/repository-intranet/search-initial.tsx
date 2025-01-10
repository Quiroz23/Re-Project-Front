'use client';

import { useRouter } from 'next/navigation'; // Importamos el hook de navegación
import { useState } from 'react';
import { Input } from "../ui/input";
import { BsSearch } from "react-icons/bs";

export default function SearchBarInitial() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Redirige a la página de resultados con la query (vacía o no)
    router.push(`/repository-intranet/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mt-28 text-center w-full bg-zinc-100 py-4 rounded-xl">
      <p className="text-black font-semibold text-3xl pb-4">
        ¿Qué estás buscando?
      </p>
      <form className="flex justify-center items-center w-full gap-2">
        <Input
          className="text-black bg-white border-2 rounded-lg w-2/3 h-12 focus:border-red-600"
          placeholder="Buscar Documento Académico..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-red-700 text-white rounded-full px-6 h-12 hover:bg-red-600"
          onClick={onClick}
        >
          <BsSearch size={22} />
        </button>
      </form>
    </div>
  );
}
