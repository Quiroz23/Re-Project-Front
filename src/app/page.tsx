import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InitialHome() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-zinc-50">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-8">RE-PROJECTS</h1>
        <p className=" px-48 text-xl font-medium">Este proyecto está diseñado para proporcionar una solución eficiente y segura para la gestión y accesibilidad de documentos académicos. Nuestro enfoque principal es garantizar la protección de los archivos almacenados, mientras facilitamos su organización y acceso para estudiantes, docentes y personal administrativo. A través de esta plataforma, buscamos promover la transparencia, la eficiencia y la seguridad en el manejo de información académica clave, fortaleciendo el crecimiento y la innovación en el ámbito educativo.</p>
        <p className="mt-2 font-medium">Atte. Desarrolladores de Re-Projects</p>
        <Link href="/login" passHref>
          <Button asChild className="mt-10">
            <p>Iniciar Sesión</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}