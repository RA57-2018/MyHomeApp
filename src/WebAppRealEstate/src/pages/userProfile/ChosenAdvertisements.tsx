import { Advertisement } from '@/components';
import { UserContext } from '@/contexts';
import { initialAxiosResponse } from '@/helpers';
import { useGetChosenAdvertisementQuery } from '@/services';
import { useContext } from 'react';

export const ChosenAdvertisements = () => {
  const { currentUser } = useContext(UserContext);

  const { data: chosenAdvertisements = initialAxiosResponse, isLoading } = useGetChosenAdvertisementQuery(currentUser?.firstName ?? '');

  return (
    <>
      <Advertisement advertisement={chosenAdvertisements} isLoading={isLoading} isChosen={true} />
    </>
  );
};
