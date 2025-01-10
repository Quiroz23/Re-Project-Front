import { useState } from "react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import useRegister from "@/hooks/use-register";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useGetSectionsTeacherQuery } from "@/redux/features/apiAcademic";

import { usePutProfileMutation } from "@/redux/features/apiUser";
import { Card } from "../ui/card";


export default function RegisterFormSection(){
  const { onChange, onSubmit, resetForm, isRegistering, formData, errors } = useRegister();
  const [isModalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({ first_name: "", last_name: "", section: "" });
  const [profileId, setProfileId] = useState<number | null>(null);
  const { data: user } = useRetrieveUserQuery();
  const {data: sections} = useGetSectionsTeacherQuery({teacherId: user?.id || 0});
  const [putProfile, { isLoading: isUpdatingProfile }] = usePutProfileMutation();
  

  const handleProfileSubmit = async () => {
    try {
      if (!profileId) {
        toast.error("No se encontró un ID de perfil válido.");
        return;
      }
  
      const payload = {
        id: profileId,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        section: profileData.section,
      };
  
      console.log("Datos enviados para actualizar perfil:", payload);
  
      const response = await putProfile(payload).unwrap();
  
      toast.success(`Perfil actualizado para ${response.first_name} ${response.last_name} `);
      setModalOpen(false);
      setProfileData({ first_name: "", last_name: "", section: "" });
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Error al actualizar el perfil.");
    }
  };
  

  return (
    <Card className="px-8 py-10 sm:w-72 md:w-1/3">
      <p className="text-center text-2xl font-semibold pb-6">Registrar Estudiante</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const userId = await onSubmit(e);
          if (userId) {
            setProfileId(userId); // Guarda el ID del perfil para el PATCH
            setModalOpen(true);
          } else {
            console.error("ID del usuario registrado:", userId);
          }
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            name="email"
            id="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            disabled={isRegistering}
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            name="password"
            id="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            disabled={isRegistering}
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
        <Button type="submit" disabled={isRegistering}>
          {isRegistering ? "Registrando..." : "Registrar"}
        </Button>
      </form>

      {/* Modal para completar perfil */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        isDismissable={false}
        className="w-2/3 py-6 flex"
      >
        <ModalContent>
          <ModalHeader className="flex justify-center text-xl">
            Completar Información y Asignar Sección
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <Label htmlFor="first_name">Nombre:</Label>
              <Input
                type="text"
                id="first_name"
                value={profileData.first_name}
                onChange={(e) =>
                  setProfileData({ ...profileData, first_name: e.target.value })
                }
                placeholder="Introduce el Nombre"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="last_name">Apellido:</Label>
              <Input
                type="text"
                id="last_name"
                value={profileData.last_name}
                onChange={(e) =>
                  setProfileData({ ...profileData, last_name: e.target.value })
                }
                placeholder="Introduce el Apellido"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="section">Sección:</Label>
              <select
                id="area"
                className="border p-2 rounded text-sm ml-2"
                onChange={(e) =>
                  setProfileData({ ...profileData, section: e.target.value  })
                }
              >
                <option value="">Selecciona una area</option>
                {sections?.map((section) => (
                  <option key={section.id} value={section.id}>
                    ID: {section.id} | {section.section_name}
                  </option>
                ))}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setModalOpen(false)}
              disabled={isUpdatingProfile}
              className="mr-2 bg-red-700 hover:bg-red-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleProfileSubmit}
              disabled={
                isUpdatingProfile ||
                !profileData.first_name ||
                !profileData.last_name ||
                !profileData.section
              }
              className="bg-green-700 hover:bg-green-600"
            >
              {isUpdatingProfile ? "Guardando..." : "Guardar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
