import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { Box, Button, Text as Info, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';

import { CustomNumberInput, StripeContainer } from '@/components';
import { useErrorToast, useSuccessToast } from '@/helpers';
import { useBuyPointsMutation } from '@/services';
import { BuyPointsProps } from '@/types';
import { useState } from 'react';

interface PointsProps {
  width?: string;
};

export const BuyPointsForm = (props: PointsProps) => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const [isBought, setIsBought] = useState(false);
  const [pointsNum, setPointsNum] = useState(0);

  const { mutate: buyPoints } = useBuyPointsMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const initialValues = {
    points: 1
  };

  const buyPointsSchema = Yup.object().shape({
    points: Yup.number()
      .min(1, t('minPoints'))
  });

  const handleSubmit = (values: BuyPointsProps) => {
    setPointsNum(values?.points);
    setIsBought(true);
  };

  return (
    <>
      {isBought ? (
        <StripeContainer points={pointsNum} />
      ) : (
        <VStack mt='2%'>
          <Box bg='blue.200' width={props.width} borderRadius='10' padding='3%' textColor='white'>
            <Formik
              validateOnMount
              validateOnChange
              initialValues={initialValues}
              validationSchema={buyPointsSchema}
              onSubmit={handleSubmit}>
              {({ isSubmitting, isValid, setFieldValue, errors, values }) => (
                <Form>
                  <Box
                    mb={5}
                    fontSize='18'
                    fontWeight='500'
                    bg='blue.500'
                    borderRadius={'lg'}
                    p='2%'>
                    <Info>{`${t('standard')} - ${t('free')}`}</Info>
                    <Info>{`${t('premium')} - ${t('premiumPay')}`}</Info>
                    <Info>{`${t('top')} - ${t('topPay')}`}</Info>
                    <Info mt={3} fontWeight={'500'}>{t('pointsCost')}</Info>
                  </Box>
                  <CustomNumberInput
                    label={t('choosePoints')}
                    name='points'
                    isInvalid={!!errors.points}
                    min={1}
                    error={errors.points}
                    onChange={(event: string) => setFieldValue('points', event)}
                  />
                  <Info>{`${values?.points*50} ${t('points')}`}</Info>
                  <Button
                    type='submit'
                    mt={10}
                    marginLeft='65%'
                    minW='100px'
                    size='lg'
                    colorScheme='blue'
                    cursor='pointer'
                    disabled={isSubmitting || !isValid}>
                    {t('buyPoints')}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </VStack>
      )}
    </>
  );
};
