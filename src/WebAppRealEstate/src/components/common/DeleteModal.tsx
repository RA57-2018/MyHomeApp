import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

  interface DeleteModalProps {
      isOpen: boolean;
      onClose: () => void;
      handleDelete: () => void;
  };

export const DeleteModal = (props: DeleteModalProps) => {
  const [t] = useTranslation('common');

  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent textColor='white' bg='blue.200'>
          <ModalHeader textColor='blue.800' fontWeight={'500'}>{t('delete')}</ModalHeader>
          <ModalCloseButton bg='blue.500' _hover={{bg: 'blue.600'}} />
          <ModalBody fontSize={'18'}>
            {t('deleteMessage')}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={props.onClose}>{t('close')}</Button>
            <Button colorScheme='blue' onClick={props.handleDelete}>{t('delete')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

