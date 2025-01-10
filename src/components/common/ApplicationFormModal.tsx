import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { usePostApplicationFormMutation } from "@/redux/features/apiDocument";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

interface CustomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: number | undefined;
  studentId: number | undefined;
  refetch: () => void;
}

export default function ApplicationFormModal({
  isOpen,
  onClose,
  documentId,
  studentId,
  refetch,
}: CustomFormModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [postApplicationForm] = usePostApplicationFormMutation();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!documentId || !studentId) {
      toast.error("Documento o estudiante no encontrado.");
      return;
    }

    if (reason.trim() === "") {
      setError("El campo razón es obligatorio.");
      return;
    }

    setError(""); // Limpia el error antes de enviar

    const formData = new FormData();
    formData.append("document", documentId.toString());
    formData.append("reason", reason);
    formData.append("student", studentId.toString());
    formData.append("state", "1");

    try {
      const response = await postApplicationForm(formData).unwrap();
      toast.success("Solicitud enviada con éxito");
      console.log("Respuesta del servidor:", response);
      refetch(); // Realiza el update de la validación de que ya hay una solicitud pendiente del documento
      onClose();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un error al enviar la solicitud.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeButton
      aria-labelledby="modal-title"
    >
      <ModalContent>
        <ModalHeader>
          <h1 id="modal-title">Solicitud de Lectura</h1>
        </ModalHeader>
        <ModalBody>
          <p>Documento ID: {documentId}</p>
          <Textarea
            name="reason"
            placeholder="Escribe la razón de la solicitud"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            aria-invalid={error ? "true" : "false"}
          />
          {error && <p className="text-red-600 text-sm ml-2">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <form onSubmit={onSubmit} style={{ display: "flex", gap: "1rem" }}>
            <Button type="submit">Enviar</Button>
          </form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
