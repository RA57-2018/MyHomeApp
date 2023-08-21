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
  Spinner
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { CustomInput } from '../common/CustomInput';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useEditMessageMutation, useGetMessageQuery } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { EditMessageProps } from '@/types';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    messageId: number;
};

export const EditModal = (props: EditModalProps) => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { data: message, isLoading } = useGetMessageQuery(props.messageId);

  const { mutate: editMessage } = useEditMessageMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const editMessageSchema = Yup.object().shape({
    sender: Yup.string(),
    responser: Yup.string(),
    requestMessage: Yup.string(),
    responseMessage: Yup.string()
  });

  const getInitialValues = (): EditMessageProps => {
    return {
      sender: message?.data?.createdBy,
      responser: message?.data?.updatedBy,
      requestMessage: message?.data?.requestMessage,
      responseMessage: message?.data?.responseMessage
    };
  };

  const handleSubmit = (values: EditMessageProps) => {
    const payload: EditMessageProps = {
      sender: values.sender,
      responser: values.responser,
      requestMessage: values.requestMessage,
      responseMessage: values.responseMessage
    };
    const id = props.messageId;
    editMessage({id: id, payload: payload});
    props.onClose();
  };

  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent textColor='white' bg='blue.200' >
          {isLoading ? (
            <Spinner />
          ) : (
            <Formik
              validateOnMount
              validateOnChange
              initialValues={getInitialValues()}
              validationSchema={editMessageSchema}
              onSubmit={handleSubmit}>
              {({ isSubmitting, isValid, errors, touched }) => (
                <Form>
                  <ModalHeader textColor='blue.800' fontWeight={'500'}>{t('edit')}</ModalHeader>
                  <ModalCloseButton bg='blue.500' _hover={{bg: 'blue.600'}} />
                  <ModalBody fontSize={'18'}>
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='sender'
                      label={t('sender')}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='responser'
                      label={t('responser')}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='requestMessage'
                      label={t('request')}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='responseMessage'
                      label={t('response')}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={props.onClose}>{t('close')}</Button>
                    <Button colorScheme='blue' type='submit'>{t('edit')}</Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

