'use client';

import useSearchFilter from "@/hooks/use-search";
import { useState } from "react";
import { Input } from "../ui/input";
import { BsSearch } from "react-icons/bs";
import { Button } from "../ui/button";

interface SearchBarProps {
  getSearchResults: (results: any[]) => void;
  queryParam: string;
}

// Recibe los resultados de la búsqueda y la query inicial
export default function SearchBar({ getSearchResults, queryParam }: SearchBarProps) {
  const [query, setQuery] = useState(queryParam);
  const { results, isLoading } = useSearchFilter(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Pasar los resultados del hook para que sean mostrados
    getSearchResults(results);
  };

  return (
    <div className="text-center w-full">
      <form onSubmit={handleSubmit} className="flex justify-center items-center w-full gap-2">
        <Input
          className="text-black border-2 rounded-lg w-2/3 h-12 focus:border-red-600"
          placeholder="Buscar Documento Académico..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button className="bg-red-700 text-white rounded-full px-6 h-12 hover:bg-red-600" type="submit">
          <BsSearch size={22} />
        </Button>
      </form>
    </div>
  );
}
