
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,

  } from "@nextui-org/react";
import FormAdmin from "./FormAdmin";


interface ModalAdmin {
    isOpen: boolean;
    onClose: () => void;
    method: 'typeDocument' | 'area';
    
  }
  
export default function ModalAdmin({ isOpen, onClose, method }: ModalAdmin) {
    


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
            <ModalHeader>
                <h2>{method === 'typeDocument' ? 'Tipo de Documento' : 'Area'}</h2>
            </ModalHeader>
            <ModalBody>
                <FormAdmin method={method} onClose={onClose}/>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </ModalContent>

        </Modal>
    )
}