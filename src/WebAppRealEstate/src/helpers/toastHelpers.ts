import { useTranslation } from 'react-i18next';
import { useToast as useChakraToast } from '@chakra-ui/react';

export const useSuccessToast = () => {
  const [t] = useTranslation('common');
  return useChakraToast({
    title: t('successTitle'),
    status: 'success',
    isClosable: true,
    position: 'top-right'
  });
};

export const useErrorToast = () => {
  const [t] = useTranslation('common');
  return useChakraToast({
    title: t('errorTitle'),
    status: 'error',
    isClosable: true,
    position: 'top-right'
  });
};

export const useInfoToast = (duration = 5000) => {
  const [t] = useTranslation('common');
  return useChakraToast({
    title: t('infoTitle'),
    status: 'info',
    isClosable: true,
    position: 'top-right',
    duration: duration
  });
};

export const useWarningToast = () => {
  const [t] = useTranslation('common');
  return useChakraToast({
    title: t('warningTitle'),
    status: 'warning',
    isClosable: true,
    position: 'top-right'
  });
};
