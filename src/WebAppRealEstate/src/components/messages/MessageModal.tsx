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
import { ResponseProps, ResponseToProps } from '@/types';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useResponseMessageMutation } from '@/services';

interface MessagesProps {
    modalOpen: boolean;
    onClose: () => void;
    requestMessage?: string;
    idMessage: number;
};

export const MessageModal = (props: MessagesProps) => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { mutate: respondToMessage } = useResponseMessageMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const initialValues = {
    responseMessage: ''
  };

  const messagesSchema = Yup.object().shape({
    response: Yup.string()
  });

  const handleSubmit = (values: ResponseProps) => {
    const payloadMessage: ResponseToProps = {
      responseMessage: values?.responseMessage,
    };
    props.onClose();
    const id = props.idMessage;
    respondToMessage({id: id, payload: payloadMessage});
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
                  <Info fontWeight='medium'>{t('request')}</Info>
                  <Info>{props.requestMessage}</Info>
                  <CustomInput
                    type='text'
                    isInvalid={!!errors.responseMessage && touched.responseMessage}
                    name='responseMessage'
                    label={t('response')}
                    error={errors.responseMessage}
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
