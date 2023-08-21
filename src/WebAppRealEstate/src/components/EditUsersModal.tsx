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
import { useTranslation } from 'react-i18next';
import { useEditUserMutation, useGetUserById } from '@/services';
import * as Yup from 'yup';
import { UserPersonalDataProps } from '@/types';
import { CustomInput } from './common/CustomInput';
import { initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
};

export const EditUsersModal = (props: EditModalProps) => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { data: user = initialAxiosResponse, isLoading } = useGetUserById(props.userId);

  const { mutate: editUser } = useEditUserMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const editMessageSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    phoneNumber: Yup.string(),
    address: Yup.string()
  });

  const getInitialValues = (): UserPersonalDataProps => {
    return {
      firstName: user?.data?.firstName ?? '',
      lastName: user?.data?.lastName ?? '',
      phoneNumber: user?.data?.phoneNumber ?? '',
      address: user?.data?.address ?? ''
    };
  };

  const handleSubmit = (values: UserPersonalDataProps) => {
    const payloadUser: UserPersonalDataProps = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      address: values.address
    };
    const id = props.userId;
    editUser({id: id, payload: payloadUser});
    props.onClose();
  };

  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent textColor='white' bg='blue.200'>
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
                      name='firstName'
                      label={t('firstName')}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='lastName'
                      label={t('lastName')}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='phoneNumber'
                      label={t('phoneNumber')}
                    />
                    <CustomInput
                      type='text'
                      maxLength={50}
                      name='address'
                      label={t('address')}
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

