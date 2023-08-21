import { Advertisement } from '@/components';
import { initialAxiosResponse } from '@/helpers';
import { useGetAllAdvertisementsQuery } from '@/services';

export const AllAdvertisements = () => {

  const { isLoading, data: allAdvertisements = initialAxiosResponse } = useGetAllAdvertisementsQuery();

  return (
    <>
      <Advertisement advertisement={allAdvertisements} isLoading={isLoading} isMyAdvertisement={true} />
    </>
  );
};
