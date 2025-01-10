import {
  usePostCareerMutation,
  usePostSectionMutation,
  usePostSignatureMutation,
  useGetCareersQuery,
  useGetSignaturesQuery,
} from "@/redux/features/apiAcademic";

import { useGetUsersQuery } from "@/redux/features/apiUser";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalReAreaProps {
  isOpen: boolean;
  onClose: () => void;
  IdFun?: number | null;
  gestionProp: "carrera" | "asignatura" | "seccion"; // Aseguramos que solo pueda ser uno de estos tres valores
  onSuccess: () => void;
}

export default function ModalReArea({
  isOpen,
  onClose,
  gestionProp,
  IdFun,
  onSuccess
}: ModalReAreaProps) {
  const [name, setName] = useState(""); // El nombre del área que se va a crear
  const [semester, setSemester] = useState(""); // El nombre del área que se va a crear
  const [codeSignature, setCodeSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Para mostrar el estado de carga

  // Accedemos a las mutaciones de la API
  const [postCareer] = usePostCareerMutation();
  const [postSignature] = usePostSignatureMutation();
  const [postSection] = usePostSectionMutation();
  const { data: careers = [] } = useGetCareersQuery();
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const { data: signatures = [] } = useGetSignaturesQuery();
  const [selectedSignature, setSelectedSignature] = useState<number | null>(
    null
  );
  const careersFArea = careers.filter((career) => career.area === IdFun);

  const signaturesFArea = signatures.filter((signature) => {
    const career = careers.find((c) => c.id === signature.career);
    return career?.area === IdFun;
  });
  

  const { data: users, refetch } = useGetUsersQuery();

  console.log(users);

  const isTeacher = users?.filter((user) => user.group?.name === 'Profesor' || user.group?.name === 'Profesor Guía' ) || []; /* Necesito revisar esto  */

  console.log(isTeacher);

  const [selectedProfesor, setSelectedProfesor] = useState<number | null>(null);


  // Refetch users data when the page loads
  useEffect(() => {
    refetch(); // Actualiza la lista de usuarios al cargar la página
  }, [refetch]);

  const handleCreate = async () => {
    refetch();
    if (name.trim() === "") return; // Evitar crear si el nombre está vacío

    setIsLoading(true); // Activamos el loading

    try {
      // Dependiendo de la propiedad `gestionProp`, llamamos a la mutación correspondiente
      switch (gestionProp) {
        case "carrera":
          const CareerData = new FormData();
          CareerData.append("career_name", name);
          CareerData.append("area", String(IdFun));
          await postCareer(CareerData) // Llamada a la mutación para crear carrera
            .then(() => {
              toast.success(`Carrera creada con exito`);
            })
            .catch((error) => {
              console.error("Error al crear la carrera:", error);
            });
          break;
        case "asignatura":
          const AsignatureData = new FormData();
          AsignatureData.append("signature_name", name);
          AsignatureData.append("code_signature", codeSignature);
          AsignatureData.append("career", String(selectedCareer));
          AsignatureData.append("semester", semester);
          try {
            const response = await postSignature(AsignatureData).unwrap();
            toast.success(`Asignatura creada con éxito`);
            console.log("Respuesta del servidor:", response);
          } catch (error) {
            console.error("Error al crear la asignatura:", error);
          }
          break;
        case "seccion":
          const SecctionData = new FormData();
          SecctionData.append("section_name", name);
          SecctionData.append("teacher_guide", String(selectedProfesor));
          SecctionData.append("signature", String(selectedSignature));

          console.log("Contenido de sectionData:");
          for (const [key, value] of SecctionData.entries()) {
            console.log(`${key}: ${value}`);
          }

          try {
            // Llamada a la mutación para crear sección
            await postSection(SecctionData).unwrap();
            toast.success(`Sección creada con éxito`);
          } catch (error) {
            console.error("Error al crear la sección:", error);
          }
          break;
        default:
          console.error("Gestión no válida"); // Si llega otro valor por error
          break;
      }
      // Después de la creación exitosa, llama a onSuccess para actualizar la tabla
    if (onSuccess) {
      onSuccess();
    }
      // Después de la creación, limpiamos el campo y cerramos el modal
      setName("");
      setCodeSignature("");
      setSemester("");
      onClose();
    } catch (error) {
      console.error("Error al crear:", error);
    } finally {
      setIsLoading(false); // Desactivamos el loading
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h1>
            Crear {gestionProp.charAt(0).toUpperCase() + gestionProp.slice(1)}
          </h1>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Nombre"
              name="nameInput"
              placeholder={`Ingresa el nombre de ${gestionProp}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              isClearable
            />
            {gestionProp === "asignatura" && (
              <>
                <Input
                  className="pt-4"
                  label="Codigo de la asignatura"
                  name="codeAsignature"
                  placeholder={`Ingresa el codigo de la asignatura`}
                  type="text"
                  value={codeSignature?.toString() || ""}
                  onChange={(e) => setCodeSignature(e.target.value)}
                  fullWidth
                  isClearable
                />
                <Select
                  className="pt-4"
                  label="Carrera"
                  placeholder="Selecciona la carrera"
                  value={selectedCareer?.toString() || ""}
                  onChange={(e) => setSelectedCareer(Number(e.target.value))}
                  fullWidth
                >
                  {careersFArea.map((career) => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.career_name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  className="pt-4"
                  label="Semestre"
                  name="semesterInput"
                  placeholder={`Ingresa el semestre que pertenece la asignatura`}
                  type="number"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  fullWidth
                  isClearable
                />
              </>
            )}
            {gestionProp === "seccion" && (
              <>
                <Select
                  className="pt-4"
                  label="Asignatura"
                  placeholder="Selecciona la Asignatura"
                  value={selectedSignature || ""} // Usa directamente el número, no lo conviertas a string
                  onChange={(e) => setSelectedSignature(Number(e.target.value))} // Convierte explícitamente a número
                  fullWidth
                >
                  {signaturesFArea.map((signature) => (
                    <SelectItem key={signature.id} value={signature.id}>
                      {signature.signature_name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  className="pt-4"
                  label="Profesor Guía"
                  placeholder="Selecciona un Profesor Guía para la sección"
                  value={selectedProfesor || ""} // Usa directamente el número, no lo conviertas a string
                  onChange={(e) => setSelectedProfesor(Number(e.target.value))} // Convierte explícitamente a número
                  fullWidth
                >
                  {isTeacher.map((teacher) => (
                    <SelectItem key={String(teacher.id)} value={teacher.id}>
                      {teacher.email}
                    </SelectItem>
                  ))}
                </Select>
              </>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleCreate}
            isLoading={isLoading} // Mostrar estado de carga en el botón
            isDisabled={!name.trim()} // Deshabilitar si no hay texto
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
