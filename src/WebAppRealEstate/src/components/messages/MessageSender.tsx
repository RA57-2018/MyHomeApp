import { useTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text as Info
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { CustomInput } from '../common/CustomInput';
import { MessageProps } from '@/types';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useSendMessageMutation } from '@/services';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserProvider';

interface MessagesProps {
    modalOpen: boolean;
    onClose: () => void;
    replier?: string;
};

export const MessageSender = (props: MessagesProps) => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const { currentUser } = useContext(UserContext);

  const { mutate: sendMessage } = useSendMessageMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const initialValues = {
    requestMessage: ''
  };

  const messagesSchema = Yup.object().shape({
    requestMessage: Yup.string()
  });

  const handleSubmit = (values: MessageProps) => {
    const payload = {
      requestMessage: values.requestMessage,
      email: currentUser?.email,
      sender: currentUser?.id,
      replier: props.replier
    };
    sendMessage(payload);
    props.onClose();
  };

  return (
    <>
      <Modal isCentered isOpen={props.modalOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent textColor='white' bg='blue.200'>
          <ModalHeader textColor='blue.800' fontSize='24'>{t('sendMessage')}</ModalHeader>
          <ModalCloseButton bg='blue.500' _hover={{bg: 'blue.600'}} />
          <Formik
            validateOnMount
            validateOnChange
            initialValues={initialValues}
            validationSchema={messagesSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form>
                <ModalBody>
                  <Info fontSize='20'>{t('writeYourMessage')}</Info>
                  <CustomInput
                    type='text'
                    maxLength={50}
                    isInvalid={!!errors.requestMessage && touched.requestMessage}
                    name='requestMessage'
                    label={t('message')}
                    error={errors.requestMessage}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                    {t('cancel')}
                  </Button>
                  <Button type='submit' colorScheme='blue'>{t('request')}</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
