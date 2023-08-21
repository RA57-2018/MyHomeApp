import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IconButton, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';

import { DeleteModal, EditModal } from '@/components';
import { AxiosResponse } from 'axios';
import { useDeleteMessageMutation, useGetAllMessagesQuery } from '@/services';
import { initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';

export const AdminMessages = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [id, setId] = useState<number>(0);
  const [t] = useTranslation('common');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { data: messageData = initialAxiosResponse, isLoading } = useGetAllMessagesQuery();

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
          <TableContainer overflowY='auto' h='full' borderRadius='lg' mt={3} ml={5} mr={5}>
            <Table fontWeight={'500'} fontSize='18' variant='striped' colorScheme='blue' borderRadius='lg'>
              <Thead bg='blue.300' whiteSpace='break-spaces' textColor='white'>
                <Tr textColor='blue.800'>
                  <Td fontWeight='bold'>{t('sender')}</Td>
                  <Td fontWeight='bold'>{t('message')}</Td>
                  <Td fontWeight='bold'>{t('response')}</Td>
                  <Td fontWeight='bold'>{t('responser')}</Td>
                  <Td fontWeight='bold'>{t('edit')}</Td>
                  <Td fontWeight='bold'>{t('delete')}</Td>
                </Tr>
              </Thead>
              <Tbody textColor='white' bg='blue.300'>
                {messageData?.data?.map((x: any, i: number) => (
                  <Tr key={i}>
                    <Td>{x.createdBy}</Td>
                    <Td>{x.requestMessage}</Td>
                    <Td>{x.responseMessage}</Td>
                    <Td>{x.updatedBy}</Td>
                    <Td>
                      <IconButton
                        bg='none'
                        title={t('delete')}
                        _hover={{bg: 'blue.400'}}
                        aria-label={''}
                        icon={<EditIcon />}
                        onClick={() => {
                          setEditModalOpen(true);
                          setId(x.id);
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
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        messageId={id}
      />
    </>
  );
};

