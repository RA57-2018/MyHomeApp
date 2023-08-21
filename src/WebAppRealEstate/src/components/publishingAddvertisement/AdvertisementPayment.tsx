import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Text as Info,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';

import { UserContext } from '@/contexts';
import { ADVERTISEMENT_ENUM } from '@/enums';
import { initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useGetLastQuery, usePublishAdvertisementPayMutation } from '@/services';
import { useQueryClient } from '@tanstack/react-query';

export const AdvertisementPayment = () => {
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');
  const { currentUser } = useContext(UserContext);
  let obj = {};
  let userDetails = {};

  const { mutate: publishPay } = usePublishAdvertisementPayMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulStatusChanged', { response }) });
    },
    onError: () => {
      errorToast({ title: t('unsuccessfulStatusChanged') });
    }
  });

  const addForm = localStorage.getItem('publishForm');
  useEffect(() => {
    if (addForm !== null) {
      obj = JSON.parse(addForm);
    }
  }, [obj]);

  const addUserDetails = localStorage.getItem('userDetails');
  useEffect(() => {
    if (addUserDetails !== null) {
      userDetails = JSON.parse(addUserDetails);
    }
  }, [userDetails]);

  const {data: lastAdv = initialAxiosResponse} = useGetLastQuery();

  const publishAdvertisement = (values: string) => {
    if (values === '2') {
      if (currentUser && currentUser.points < 4) {
        alert(t('alertBuyPoints'));
      } else {
        const isPublishedPay = {
          isPublished: true,
          values: Number(values),
          userId: currentUser?.id
        };
        publishPay({idAdvertisement: lastAdv?.data?.id, payload: isPublishedPay});
      }
    } else if (values === '3') {
      if (currentUser && currentUser.points < 6) {
        alert(t('alertBuyPoints'));
      } else {
        const isPublishedPay = {
          isPublished: true,
          values: Number(values),
          userId: currentUser?.id
        };
        publishPay({idAdvertisement: lastAdv?.data?.id, payload: isPublishedPay});
      }
    } else {
      alert('Your advertisement is standard!');
      const isPublishedPay = {
        isPublished: true,
        values: Number(values),
        userId: currentUser?.id
      };
      publishPay({idAdvertisement: lastAdv?.data?.id, payload: isPublishedPay});
    }
  };

  return (
    <>
      <FormLabel textColor='white' fontSize='22'>{t('chooseAdvertisementType')}</FormLabel>
      <Grid>
        <GridItem>
          <RadioGroup onChange={setValue} value={value}>
            <Stack direction='column'>
              <Radio value={ADVERTISEMENT_ENUM.STANDARD.toString()}>{t('standard')}</Radio>
              <Radio value={ADVERTISEMENT_ENUM.PREMIUM.toString()}>{t('premium')}</Radio>
              <Radio value={ADVERTISEMENT_ENUM.TOP.toString()}>{t('top')}</Radio>
            </Stack>
          </RadioGroup>
        </GridItem>
        <Info fontWeight={'500'} fontSize={'18'} mt={3}>{`${t('youHave')} ${currentUser?.points} ${t('numOfPoints')}`}</Info>
        <HStack mt='2%'>
          <Button
            minW='100px'
            size='lg'
            top='15px'
            bg='blue.600'
            _hover={{bg: 'blue.400'}}
            ml={0}
            cursor='pointer'
            onClick={() => publishAdvertisement(value)}>
            {t('publish')}
          </Button>
        </HStack>
      </Grid>
    </>
  );
};
