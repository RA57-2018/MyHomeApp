import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react';

import { MyData } from './MyData';
import { ChosenAdvertisements } from './ChosenAdvertisements';
import { Messages } from './Messages';
import { PublishAdvertisement } from './PublishAdvertisement';
import { BuyPoints } from './BuyPoints';
import { MyAdvertisements } from './MyAdvertisements';
import { useContext } from 'react';
import { UserContext } from '@/contexts';

export const UserProfile = () => {
  const [t] = useTranslation('common');
  const { currentUser } = useContext(UserContext);

  return (
    <VStack gap={1} align='stretch'>
      {currentUser?.roleId === 1 ? (
        <MyData />
      ) : (
        <Tabs isLazy isFitted variant='enclosed-colored' minH='100%'>
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
              {t('myData')}
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
              {t('chosenAdvertisements')}
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
              {t('messages')}
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
              {t('publishAdvertisement')}
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
              {t('buyPoints')}
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
              {t('myAdvertisements')}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                {<MyData />}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                {<ChosenAdvertisements />}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                {<Messages />}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                {<PublishAdvertisement />}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                {<BuyPoints />}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack mr='2rem' ml='2rem' gap={1} align='stretch'>
                {<MyAdvertisements />}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </VStack>
  );
};
