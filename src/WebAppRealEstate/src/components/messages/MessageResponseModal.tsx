import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
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
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';

import { CustomInput } from '../common/CustomInput';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useRequestMessageMutation } from '@/services';
import { RequestToProps } from '@/types';

interface MessagesProps {
    modalOpen: boolean;
    onClose: () => void;
    responseMessage?: string;
    idMessage: number;
};

export const MessageResponseModal = (props: MessagesProps) => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { mutate: requestToMessage } = useRequestMessageMutation(queryClient, {
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
    request: Yup.string()
  });

  const handleSubmit = (values: RequestToProps) => {
    const payloadMessage: RequestToProps = {
      requestMessage: values?.requestMessage,
    };
    props.onClose();
    const id = props.idMessage;
    requestToMessage({id: id, payload: payloadMessage});
  };

  return (
    <>
      <Modal isCentered isOpen={props.modalOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent textColor='white' bg='blue.200'>
          <ModalHeader textColor='blue.800' fontSize='24'>{t('Response')}</ModalHeader>
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
                  <Info fontWeight='medium'>{t('response')}</Info>
                  <Info>{props.responseMessage}</Info>
                  <CustomInput
                    type='text'
                    isInvalid={!!errors.requestMessage && touched.requestMessage}
                    name='requestMessage'
                    label={t('request')}
                    error={errors.requestMessage}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                    {t('cancel')}
                  </Button>
                  <Button type='submit' colorScheme='blue'>{t('response')}</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
