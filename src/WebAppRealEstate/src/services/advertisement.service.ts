import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../helpers';
import { EditAdvertisementType, FastSearch, Ids, LocationSearch, Options, PayType, PublishAdveretismentProps, RealEstateTypesProps, UploadImageType } from '@/types';

const ADVERTISEMENT_API_URL = '/v1/advertisement';

const ADVERTISEMENT_QUERY_KEY = 'advertisement';
const ADVERTISEMENT_IMAGE_QUERY_KEY = 'advertisementImage';
const ADVERTISEMENT_LAST_QUERY_KEY = 'last';
const ADVERTISEMENT_CHOSEN_QUERY_KEY = 'chosen';

export const advertisement_api = {
  advertisement: () => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}`),
  buyPoints: (points: number) => axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}`, points),
  chooseAdvertisement: (payload: Ids) => axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}/chooseAdvertisement`, payload),
  deleteAdvertisement: (idAdvertisement: number) => axios.delete(`${apiUrl()}${ADVERTISEMENT_API_URL}/delete/${idAdvertisement}`),
  editAdvertisement: ({idAdvertisement, payload} : {idAdvertisement: number, payload: EditAdvertisementType}) => axios.put(`${apiUrl()}${ADVERTISEMENT_API_URL}/editAdvertisement/${idAdvertisement}`, payload),
  fastSearch: (payload: FastSearch) => axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}/fastSearch`, payload),
  getAdvertisement: (idAdvertisement: number) => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}/getAdvertisement/${idAdvertisement}`),
  getAllAdvertisements: () => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}/getAllAdvertisements`),
  getSearchedAdvertisements: (payload: RealEstateTypesProps) => axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}/getSearchedAdvertisements`, payload),
  getChosenAdvertisement: (currentUserId: string) => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}/getChosenAdvertisement/${currentUserId}`),
  getLast: () => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}/getLastElement`),
  getMyAdvertisements: (id: string) => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}/getMyAdvertisements/${id}`),
  getImagesByAdvId: (idAdv: number) => axios.get(`${apiUrl()}${ADVERTISEMENT_API_URL}/images/${idAdv}`),
  locationSearch: (payload: LocationSearch) => axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}/locationSearch`, payload),
  publishAdvertisement: (payload: PublishAdveretismentProps) => axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}/publishAdvertisement`, payload),
  publishPay:
  ({idAdvertisement, payload}: {idAdvertisement: number, payload: PayType}) =>
    axios.put(`${apiUrl()}${ADVERTISEMENT_API_URL}/publishPay/${idAdvertisement}`, payload),
  uploadImage: async (params: { idAdv: number; file: FormData }) => {
    try {
      const response = await axios.post(`${apiUrl()}${ADVERTISEMENT_API_URL}/uploadImage?idAdv=${params.idAdv}`, params.file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export const useAdvertisementQuery = () => {
  return useQuery([ADVERTISEMENT_QUERY_KEY], () => advertisement_api.advertisement());
};

export const useGetImagesByAvertisement = (id: number) => {
  return useQuery([ADVERTISEMENT_IMAGE_QUERY_KEY], () => advertisement_api.getImagesByAdvId(id));
};

export const useGetLastQuery = () => {
  return useQuery([ADVERTISEMENT_QUERY_KEY], () => advertisement_api.getLast());
};

export const useBuyPointsMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.buyPoints, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useEditMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.editAdvertisement, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useGetSearchedAdvertisementsMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.getSearchedAdvertisements, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useChooseAdvertisementMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.chooseAdvertisement, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useDeleteAdvertisementMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.deleteAdvertisement, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useFastSearchMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.fastSearch, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useGetAdvertisementQuery = (id: number) => {
  return useQuery([ADVERTISEMENT_QUERY_KEY], () => advertisement_api.getAdvertisement(id), {enabled: !!id});
};

export const useGetAllAdvertisementsQuery = () => {
  return useQuery([ADVERTISEMENT_QUERY_KEY], () => advertisement_api.getAllAdvertisements());
};

export const useGetChosenAdvertisementQuery = (id: string, options?: Options) => {
  return useQuery([ADVERTISEMENT_CHOSEN_QUERY_KEY], () => advertisement_api.getChosenAdvertisement(id),
                  {
                    enabled: !!id,
                    onSuccess: () => void 0,
                    onError: (error) => {
                      options?.onError(error);
                    }
                  });
};

export const useGetMyAdvertisementsQuery = (id: string, options?: Options) => {
  return useQuery([ADVERTISEMENT_LAST_QUERY_KEY], () => advertisement_api.getMyAdvertisements(id),
                  {
                    enabled: !!id,
                    onSuccess: () => void 0,
                    onError: (error) => {
                      options?.onError(error);
                    }
                  });
};

export const useLocationSearchMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.locationSearch, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const usePublishAdvertisementMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.publishAdvertisement, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const usePublishAdvertisementPayMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(advertisement_api.publishPay, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useUploadImageMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation((params: { idAdv: number; file: FormData }) => advertisement_api.uploadImage(params), {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([ADVERTISEMENT_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};
