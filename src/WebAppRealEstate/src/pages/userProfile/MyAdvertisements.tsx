import { useContext } from 'react';

import { Advertisement } from '@/components';
import { UserContext } from '@/contexts';
import { initialAxiosResponse } from '@/helpers';
import { useGetMyAdvertisementsQuery } from '@/services';

export const MyAdvertisements = () => {
  const { currentUser } = useContext(UserContext);

  const { data: myAdvertisementsData = initialAxiosResponse, isLoading } = useGetMyAdvertisementsQuery(currentUser?.id ?? '');

  return (
    <>
      <Advertisement advertisement={myAdvertisementsData} isLoading={isLoading} isHomePage={false} />
    </>
  );
};
