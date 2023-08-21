import { useTranslation } from 'react-i18next';
import { Box, FormLabel, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react';

import { AdvertisementPayment, EnterPersonalData, PublishAdvertisementForm } from '@/components';

export const PublishAdvertisement = () => {
  const [t] = useTranslation('common');

  return (
    <>
      <VStack display='flex' alignItems='center' justifyContent='center'>
        <FormLabel textColor='blue.800' fontSize='30'>{t('publishTitle')}</FormLabel>
        <Box bg='blue.200' width='150vh' height='100%' borderRadius='10' textColor='white'>
          <Tabs isLazy isFitted variant='enclosed-colored' minH='100%' mb={3}>
            <TabList>
              <Tab
                _selected={{ color: 'white', bg: 'blue.200 !important' }}
                fontWeight='bold'
                borderBottomRadius='5px'
                fontSize='md'
                height='35'
                borderTopWidth={0}
                bg='blue.600 !important'
                color='white'>
                {t('form')}
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.200 !important' }}
                fontWeight='bold'
                borderBottomRadius='5px'
                fontSize='md'
                height='35'
                borderTopWidth={0}
                bg='blue.600 !important'
                color='white'>
                {t('enterData')}
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.200 !important' }}
                fontWeight='bold'
                borderBottomRadius='5px'
                fontSize='md'
                height='35'
                borderTopWidth={0}
                bg='blue.600 !important'
                color='white'>
                {t('chooseTypeOfAd')}
              </Tab>
            </TabList>
            <TabPanels mt='2%' display='flex' alignItems='center' justifyContent='center'>
              <TabPanel>
                <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                  {<PublishAdvertisementForm />}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                  {<EnterPersonalData />}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                  {<AdvertisementPayment />}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </>
  );
};

