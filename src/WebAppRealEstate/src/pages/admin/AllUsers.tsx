import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IconButton, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

import { DeleteModal, EditUsersModal } from '@/components';
import { initialAxiosResponse, useErrorToast, useSuccessToast } from '@/helpers';
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/services';

export const AllUsers = () => {
  const [t] = useTranslation('common');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [id, setId] = useState<string>('');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const { data: userData = initialAxiosResponse, isLoading } = useGetAllUsersQuery();

  const { mutate: deleteUser } = useDeleteUserMutation(queryClient, {
    onSuccess: (response?: AxiosResponse) => {
      successToast({ title: t('successfulPasswordSet', { response }) });
    },
    onError: () => {
      errorToast({ title: t('successfulPasswordSet') });
    }
  });

  const handleDelete = () => {
    deleteUser(id);
    setDeleteModalOpen(false);
  };

  return (
    <>
      {!isLoading && userData?.data && (
        <>
          <TableContainer overflowY='auto' h='full' borderRadius='lg' mt={3} ml={5} mr={5}>
            <Table fontWeight={'500'} fontSize='18' variant='striped' colorScheme='blue' borderRadius='lg'>
              <Thead bg='blue.300' whiteSpace='break-spaces' textColor='white'>
                <Tr textColor='blue.800'>
                  <Td fontWeight='bold'>{t('firstNameLastName')}</Td>
                  <Td fontWeight='bold'>{t('phoneNumber')}</Td>
                  <Td fontWeight='bold'>{t('edit')}</Td>
                  <Td fontWeight='bold'>{t('delete')}</Td>
                </Tr>
              </Thead>
              <Tbody textColor='white' bg='blue.300'>
                {Array.isArray(userData?.data) && userData?.data?.map((x: any, i: number) => (
                  <Tr key={i}>
                    <Td>{`${x.firstName} ${x.lastName}`}</Td>
                    <Td>{x.phoneNumber}</Td>
                    <Td>
                      <IconButton
                        bg='none'
                        title={t('edit')}
                        _hover={{bg: 'blue.400'}}
                        aria-label={'edit'}
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
                        aria-label={'delete'}
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
      <EditUsersModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userId={id}
      />
    </>
  );
};

