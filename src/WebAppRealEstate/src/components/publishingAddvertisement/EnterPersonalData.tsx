import { useTranslation } from 'react-i18next';
import { Box, Button, Text as Info, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { CustomInput } from '@/components';
import { UserPersonalDataProps } from '@/types';
import { useContext } from 'react';
import { UserContext } from '@/contexts';
import { useEditUserMutation, useGetUserById } from '@/services';
import { AxiosResponse } from 'axios';
import { initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';

export const EnterPersonalData = () => {
  const [t] = useTranslation('common');
  const { currentUser } = useContext(UserContext);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const {data: myUser = initialAxiosResponse, isLoading} = useGetUserById(currentUser?.id ?? '');

  const { mutate: editUser } = useEditUserMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulEditUser', { response }) });
    },
    onError: () => {
      errorToast({ title: t('unsuccessfulEditUser') });
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!myUser?.data) {
    return <div>User data not found.</div>;
  }

  const initialValues = {
    firstName: myUser?.data?.firstName || '',
    lastName: myUser?.data?.lastName || '',
    address: myUser?.data?.address || '',
    phoneNumber: myUser?.data?.phoneNumber || ''
  };

  const userProfileSchema = Yup.object().shape({
    firstName: Yup.string().required(t('firstNameRequired')),
    lastName: Yup.string().required(t('lastNameRequired')),
    phoneNumber: Yup.string().required(t('phoneNumberRequired')),
    address: Yup.string().required(t('addressRequired'))
  });

  const handleSubmit = (values: UserPersonalDataProps) => {
    const payload = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      phoneNumber: values?.phoneNumber,
      address: values?.address
    };
    editUser({id: currentUser?.id ?? '', payload: payload});
  };

  return (
    <>
      <VStack
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start'
        }}>
        <Box bg='blue.200' borderRadius='10' textColor='white'>
          <Formik
            validateOnMount
            validateOnChange
            initialValues={initialValues}
            validationSchema={userProfileSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting, isValid, errors, touched }) => (
              <Form>
                <CustomInput
                  type='text'
                  maxLength={50}
                  isInvalid={!!errors.firstName && touched.firstName}
                  name='firstName'
                  label={t('firstName')}
                  error={errors.firstName}
                />
                <CustomInput
                  type='text'
                  maxLength={50}
                  isInvalid={!!errors.lastName && touched.lastName}
                  name='lastName'
                  label={t('lastName')}
                  error={errors.lastName}
                />
                <CustomInput
                  type='text'
                  maxLength={50}
                  isInvalid={!!errors.phoneNumber && touched.phoneNumber}
                  name='phoneNumber'
                  label={t('phoneNumber')}
                  error={errors.phoneNumber}
                />
                <CustomInput
                  type='text'
                  maxLength={50}
                  isInvalid={!!errors.address && touched.address}
                  name='address'
                  label={t('address')}
                  error={errors.address}
                />
                <Button
                  type='submit'
                  minW='100px'
                  size='lg'
                  top='15px'
                  bg='blue.600'
                  _hover={{bg: 'blue.400'}}
                  ml={3}
                  cursor='pointer'
                  disabled={isSubmitting || !isValid}>
                  {t('continue')}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </VStack>
    </>
  );
};
