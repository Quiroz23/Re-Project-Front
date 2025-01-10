import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@nextui-org/react";
import DocumentFormEdit from "../publish-document/document-edit";
import DocumentFormManage from "./document-manage";
  
  interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentId: number | null;
    publishId: number | null;
  }
  
  export default function CustomModal({ isOpen, onClose, documentId, publishId }: CustomModalProps) {
    return (
<Modal isOpen={isOpen} onClose={onClose} size="5xl">
  <ModalContent>
    <>
      <ModalBody className="my-6">
        {/* Pasamos `onClose` como prop adicional */}
        {documentId && publishId === null ? (
          <DocumentFormEdit key={documentId} context={documentId} onClose={onClose} />
        ) : (
          <DocumentFormManage
            key={documentId}
            context={documentId}
            publishId={publishId}
            onClose={onClose} // Pasar el método onClose
          />
        )}
      </ModalBody>
    </>
  </ModalContent>
</Modal>

    );
  }
  