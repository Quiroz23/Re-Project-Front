import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import DocumentApplication from "./document-manage-application";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
}

export default function CustomModalApplication({
  isOpen,
  onClose,
  applicationId,
}: CustomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="h-fit">
      <ModalContent>
        <ModalBody className="max-w-xl">
          {applicationId ? (
            <DocumentApplication
              applicationId={applicationId}
              onClose={onClose}
            />
          ) : (
            <p>No hay Datos</p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
