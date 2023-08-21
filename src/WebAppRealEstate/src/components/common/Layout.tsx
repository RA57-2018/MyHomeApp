import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Spacer,
  Text as Info,
  VStack
} from '@chakra-ui/react';
import { UserContext } from '@/contexts';
import { useContext } from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [t] = useTranslation('common');
  const { currentUser } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    navigate('/homePage');
    window.location.reload();
  };

  return (
    <>
      <Flex p='10px' backgroundColor='blue.300' alignItems='center' verticalAlign='center'>
        <Button
          variant='unstyled'
          onClick={() => {
            navigate('/homePage');
            window.location.reload();
          }}
          fontWeight='400'
          textColor='white'
          fontSize='30'>
          {t('welcome')}
        </Button>
        <Box w='100px' />
        <Spacer />
        {currentUser ? (
          currentUser?.roleId === 1 ? (
            <>
              <Button
                mr='2'
                bg='blue.500'
                _hover={{ bg: 'blue.400' }}
                textColor='white'
                onClick={() => navigate('/allUsers')}>
                {t('allUsers')}
              </Button>
              <Button
                mr='2'
                bg='blue.500'
                _hover={{ bg: 'blue.400' }}
                textColor='white'
                onClick={() => navigate('/allAdvertisements')}>
                {t('allAdvertisements')}
              </Button>
              <Button
                mr='2'
                bg='blue.500'
                _hover={{ bg: 'blue.400' }}
                textColor='white'
                onClick={() => navigate('/adminMessages')}>
                {t('adminMessages')}
              </Button>
              <Popover>
                <PopoverTrigger>
                  <Button variant='unstyled'>
                    <Avatar
                      bg='blue.500'
                      textColor='white'
                      size='full'
                      fontSize='2.3em'
                      name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent w='auto' minW='250px' m='5px' bg='blue.300'>
                  <PopoverArrow bg='blue.300' />
                  <PopoverBody>
                    <VStack>
                      <Avatar
                        bg='blue.500'
                        textColor='white'
                        size='lg'
                        name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                        cursor='pointer'
                        onClick={() => navigate('/userProfile')}
                      />
                      <Info textColor='white'>{`${currentUser?.firstName} ${currentUser?.lastName}`}</Info>
                    </VStack>
                  </PopoverBody>
                  <PopoverFooter display='flex' justifyContent='space-around'>
                    <Button
                      bg='blue.500'
                      _hover={{bg: 'blue.400'}}
                      textColor='white'
                      onClick={logout}>
                      {t('logout')}
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Button variant='unstyled'>
                  <Avatar
                    bg='blue.500'
                    textColor='white'
                    size='full'
                    fontSize='2.3em'
                    name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent w='auto' minW='250px' m='5px' bg='blue.300'>
                <PopoverArrow bg='blue.300' />
                <PopoverBody>
                  <VStack>
                    <Avatar
                      bg='blue.500'
                      textColor='white'
                      size='lg'
                      name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                      cursor='pointer'
                      onClick={() => navigate('/userProfile')}
                    />
                    <Info textColor='white'>{`${currentUser?.firstName} ${currentUser?.lastName}`}</Info>
                  </VStack>
                </PopoverBody>
                <PopoverFooter display='flex' justifyContent='space-around'>
                  <Button
                    bg='blue.500'
                    _hover={{bg: 'blue.400'}}
                    textColor='white'
                    onClick={logout}>
                    {t('logout')}
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          )
        ) : (
          <>
            <Button
              mr='2'
              bg='blue.500'
              _hover={{ bg: 'blue.400' }}
              textColor='white'
              onClick={() => navigate('/login')}>
              {t('login')}
            </Button>
            <Button
              mr='2'
              bg='blue.500'
              _hover={{ bg: 'blue.400' }}
              textColor='white'
              onClick={() => navigate('/registration')}>
              {t('registraton')}
            </Button>
          </>
        )}
      </Flex>
      {children}
    </>
  );
};
