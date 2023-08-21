import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { ChatIcon, DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';

import { DeleteModal, MessageModal } from '@/components';
import { initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useDeleteMessageMutation, useGetMyMessagesQuery } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '@/contexts';
import { MessageResponseModal } from '@/components/messages/MessageResponseModal';

export const Messages = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [messageRequest, setMessageRequest] = useState('');
  const [messageResponse, setMessageResponse] = useState('');
  const [id, setId] = useState<number>(0);
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const {currentUser} = useContext(UserContext);
  const [isSender, setIsSender] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const { data: messageData = initialAxiosResponse, isLoading } = useGetMyMessagesQuery(currentUser?.id ?? '');

  const idUser = messageData?.data && messageData.data.length > 0 ? messageData.data[0].sender : null;

  useEffect(() => {
    if (currentUser?.id === idUser) {
      setIsSender(true);
    }
  }, [idUser]);

  const { mutate: deleteMessage } = useDeleteMessageMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const handleDelete = () => {
    deleteMessage(id);
    setDeleteModalOpen(false);
  };

  return (
    <>
      {!isLoading && messageData?.data && (
        <>
          <TableContainer overflowY='auto' h='full' borderRadius='lg'>
            <Table fontWeight={'500'} fontSize='18' variant='striped' colorScheme='blue' borderRadius='lg'>
              <Thead bg='blue.300' whiteSpace='break-spaces' textColor='white'>
                <Tr textColor='blue.800'>
                  <Td fontWeight='bold'>{t('message')}</Td>
                  <Td fontWeight='bold'>{t('response')}</Td>
                  <Td fontWeight='bold'>{t('responseToMessage')}</Td>
                  <Td fontWeight='bold'>{t('delete')}</Td>
                </Tr>
              </Thead>
              <Tbody textColor='white' bg='blue.300'>
                {messageData?.data?.map((x: any, i: number) => (
                  <Tr key={i}>
                    <Td>{x.requestMessage}</Td>
                    <Td>{x.responseMessage}</Td>
                    <Td>
                      <IconButton
                        bg='none'
                        title={t('responseToMessage')}
                        _hover={{bg: 'blue.400'}}
                        aria-label={''}
                        icon={<ChatIcon />}
                        onClick={() => {
                          isSender ? setRequestModalOpen(true) : setResponseModalOpen(true);
                          setId(x.id);
                          setMessageRequest(x.requestMessage as string);
                          setMessageResponse(x.responseMessage as string);
                        }}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        bg='none'
                        title={t('delete')}
                        _hover={{bg: 'blue.400'}}
                        aria-label={''}
                        icon={<DeleteIcon />}
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setId(x.id);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        handleDelete={handleDelete}
      />
      {isSender ? (
        <MessageResponseModal
          modalOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          responseMessage={messageResponse}
          idMessage={id}
        />
      ) : (
        <MessageModal
          modalOpen={responseModalOpen}
          onClose={() => setResponseModalOpen(false)}
          requestMessage={messageRequest}
          idMessage={id}
        />
      )}
    </>
  );
};

