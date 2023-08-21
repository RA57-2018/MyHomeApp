import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, FormControl, FormErrorMessage, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { CustomInput } from '@/components';
import { LoginType } from '@/types';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/contexts';

export const Login = () => {
  const [t] = useTranslation('common');
  const [serverError, setServerError] = useState('');
  const { login } = useContext(UserContext);
  const tokenRef = useRef<string | null>();
  tokenRef.current = localStorage['accessToken'];
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: ''
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().email(t('emailInvalid')).required('emailRequired'),
    password: Yup.string().required(t('passRequired'))
  });

  const handleSubmit = async (values: LoginType) => {
    try {
      await login(values.email, values.password);
      navigate('/homePage');
    } catch (error: any) {
      setServerError(error.response.data.detail);
    }
  };

  return (
    <VStack
      style={{
        display: 'flex',
        width: '100%',
        height: '90vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Box boxShadow='2xl' bg='blue.300' borderRadius='10' padding='5%' textColor='white'>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting, isValid, errors, touched }) => (
            <Form onInput={() => setServerError('')}>
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
              <FormControl isInvalid={!!serverError}>
                <FormErrorMessage>{serverError}</FormErrorMessage>
              </FormControl>
              <Button
                type='submit'
                minW='100px'
                size='lg'
                top='15px'
                bg='blue.600'
                _hover={{bg: 'blue.400'}}
                ml='35%'
                cursor='pointer'
                disabled={isSubmitting || !isValid || !!serverError}>
                {t('login')}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </VStack>
  );
};
