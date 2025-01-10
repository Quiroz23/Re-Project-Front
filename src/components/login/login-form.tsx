'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  useLogin  from '@/hooks/use-login';  // Importar el hook personalizado que maneja el estado del formulario y la lógica
import Image from "next/image";

export default function LoginForm() {
  const { email, password, isLoading, onChange, onSubmit } = useLogin();  // Obtención del hook para manejar la lógica del formulario

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="flex items-center justify-center">
        <Image
          src="/logo-inacap-login.webp"
          width={130}
          height={130}
          alt="Imagen del Documento"
          className="mb-4"
        />
        <CardDescription>
          Ingresa tu email y contraseña para acceder a Re-Projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email} // El valor viene del estado manejado por el hook
              onChange={onChange} // Cambiar el valor del input usando el hook
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2 pb-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              value={password} // El valor viene del estado manejado por el hook
              onChange={onChange} // Cambiar el valor del input usando el hook
              placeholder="********"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
