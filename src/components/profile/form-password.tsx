"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { FormItem } from "../ui/form";
import { usePutPasswordMutation } from "@/redux/features/apiUser";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Card, CardContent, CardHeader} from "../ui/card";
import { toast } from "react-toastify";
import Image from "next/image";




// Define el esquema con zod
const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
      .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
      .regex(/\d/, "La contraseña debe contener al menos un número."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function FormPassword() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [putPassword, { isLoading, isSuccess, error }] = usePutPasswordMutation();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await putPassword({ password: data.password }).unwrap();
      toast.success("Contraseña cambiada con éxito");
    } catch (err) {
      const apiError = err as FetchBaseQueryError;
      toast.error("Error al cambiar la contraseña");
      console.error("Error al cambiar la contraseña:", apiError);
    }
  };

  return (
    <Card className="w-2/3 p-5 flex justify-center items-center">
      <CardHeader className="w-[30%]">
        <Image
          src="/IconPerfil.webp" width={150} height={150} alt="hola mundo"/>
      </CardHeader>
      <CardContent className="w-[45%]">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      id="password"
                      placeholder="Introduce tu nueva contraseña"
                      {...field}
                    />
                    {errors.password && (
                      <div className="text-red-500">{errors.password.message}</div>
                    )}
                  </div>
                )}
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      id="confirmPassword"
                      placeholder="Confirma tu nueva contraseña"
                      {...field}
                    />
                    {errors.confirmPassword && (
                      <div className="text-red-500">{errors.confirmPassword.message}</div>
                    )}
                  </div>
                )}
              />
            </FormItem>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>

            {isSuccess && (
              <div className="text-green-500">¡Contraseña actualizada con éxito!</div>
            )}
            {error && (
              <div className="text-red-500">
                Error: {(error as FetchBaseQueryError)?.data?.detail || "Algo salió mal"}
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
