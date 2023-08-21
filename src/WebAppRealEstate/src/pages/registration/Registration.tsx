import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { Box, Button, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { CustomInput } from '@/components';
import { useRegisterUserMutation } from '@/services';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { UserRegistration } from '@/types';

export const Registration = () => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { mutate: register } = useRegisterUserMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulRegistration', { response }) });
      alert(t('checkEmail'));
    },
    onError: () => {
      errorToast({ title: t('unsuccessfulRegistration') });
    }
  });

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: ''
  };

  const registrtionSchema = Yup.object().shape({
    email: Yup.string().email(t('emailInvalid')).required('emailRequired'),
    password: Yup.string().required(t('passRequired')),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], t('passMatch')).required(t('passRequired')),
    firstName: Yup.string().required(t('firstNameRequired')),
    lastName: Yup.string().required(t('lastNameRequired')),
    phoneNumber: Yup.string().required(t('phoneNumberRequired')),
  });

  const handleSubmit = (values: UserRegistration) => {
    const payload = {
      email: values?.email,
      password: values?.password,
      firstName: values?.firstName,
      lastName: values?.lastName,
      address: values?.address,
      phoneNumber: values?.phoneNumber,
    };
    register(payload);
  };

  return (
    <VStack
      display='flex'
      alignItems='center'
      justifyContent='center'
      mt={5}>
      <Box boxShadow='2xl' backgroundColor='blue.300' borderRadius='10' padding='2%' textColor='white'>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={registrtionSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting, isValid, errors, touched }) => (
            <Form>
              <CustomInput
                type='email'
                maxLength={50}
                isInvalid={!!errors.email && touched.email}
                name='email'
                label={t('email')}
                error={errors.email}
              />
              <CustomInput
                type='password'
                maxLength={50}
                isInvalid={!!errors.password && touched.password}
                name='password'
                label={t('password')}
                error={errors.password}
              />
              <CustomInput
                type='password'
                maxLength={50}
                isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                name='confirmPassword'
                label={t('confirmPassword')}
                error={errors.confirmPassword}
              />
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
                mb={3}
                cursor='pointer'>
                {t('save')}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </VStack>
  );
};
