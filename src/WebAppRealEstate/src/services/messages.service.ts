import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../helpers';
import { EditMessageProps, MessageProps, Options, RequestToProps, ResponseToProps } from '@/types';

const MESSAGES_API_URL = '/v1/messages';

const MESSAGES_QUERY_KEY = 'messages';
const GET_MESSAGE_BY_ID_QUERY_KEY = 'getMessageById';

export const messages_api = {
  deleteMessage: (id: number) => axios.delete(`${apiUrl()}${MESSAGES_API_URL}/delete/${id}`),
  editMessages: ({id, payload}: {id: number, payload: EditMessageProps}) => axios.put(`${apiUrl()}${MESSAGES_API_URL}/editMessage/${id}`, payload),
  getAllMessages: () => axios.get(`${apiUrl()}${MESSAGES_API_URL}`),
  getMessage: (id: number) => axios.get(`${apiUrl()}${MESSAGES_API_URL}/getMessageById/${id}`),
  getMyMessages: (id: string) => axios.get(`${apiUrl()}${MESSAGES_API_URL}/getMyMessages/${id}`),
  responseMessage: ({id, payload}: {id: number, payload: ResponseToProps}) => axios.put(`${apiUrl()}${MESSAGES_API_URL}/response/${id}`, payload),
  requestMessage: ({id, payload}: {id: number, payload: RequestToProps}) => axios.put(`${apiUrl()}${MESSAGES_API_URL}/request/${id}`, payload),
  sendMessage: (payload: MessageProps) => axios.post(`${apiUrl()}${MESSAGES_API_URL}/sendMessage`, payload),
};

export const useDeleteMessageMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(messages_api.deleteMessage, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([MESSAGES_QUERY_KEY]);
      queryClient.invalidateQueries([GET_MESSAGE_BY_ID_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useEditMessageMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(messages_api.editMessages, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([MESSAGES_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useGetAllMessagesQuery = () => {
  return useQuery([MESSAGES_QUERY_KEY], () => messages_api.getAllMessages());
};

export const useGetMessageQuery = (id: number) => {
  return useQuery(
    [GET_MESSAGE_BY_ID_QUERY_KEY, {id}],
    () => messages_api.getMessage(id),
    {
      enabled: !!id
    });
};

export const useGetMyMessagesQuery = (id: string) => {
  return useQuery(
    [GET_MESSAGE_BY_ID_QUERY_KEY, {id}],
    () => messages_api.getMyMessages(id));
};

export const useResponseMessageMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(messages_api.responseMessage, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([MESSAGES_QUERY_KEY]);
      queryClient.invalidateQueries([GET_MESSAGE_BY_ID_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useRequestMessageMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(messages_api.requestMessage, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([MESSAGES_QUERY_KEY]);
      queryClient.invalidateQueries([GET_MESSAGE_BY_ID_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useSendMessageMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(messages_api.sendMessage, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([MESSAGES_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};
