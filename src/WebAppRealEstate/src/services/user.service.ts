import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../helpers';
import { Options, UserDetailsType, UserRegistration } from '@/types';

const USER_API_URL = '/v1/user';
const CURRENT_USER_API_URL = USER_API_URL + '/current-user';
const TOKEN_API_URL = '/v1/token';
export const TOKEN_REFRESH_API_URL = '/v1/token/refresh';

const CURRENT_USER_QUERY_KEY = 'current-user';
const USER_QUERY_KEY = 'user';
const TOKEN_QUERY_KEY = 'token';
const TOKEN_REFRESH_QUERY_KEY = 'token-refresh';
const GET_MY_DATA = 'get-my-data';

export const usersApi = {
  getAllUsers: () => axios.get(`${apiUrl()}${USER_API_URL}/allUsers`),
  deleteUser: (id: string) => axios.delete(`${apiUrl()}${USER_API_URL}/delete/${id}`),
  getUserById: (id: string) => axios.get(`${apiUrl()}${USER_API_URL}/user/${id}`),
  editUser: ({id, payload}: {id: string, payload: UserDetailsType}) => axios.put(`${apiUrl()}${USER_API_URL}/editUser/${id}`, payload),
  token: (email: string, pass: string) =>
    axios.post(`${apiUrl()}${TOKEN_API_URL}`, { email: email, password: pass }),
  refreshToken: (refreshToken: string) =>
    axios.post(`${apiUrl()}${TOKEN_REFRESH_API_URL}`, { refresh: refreshToken }),
  register: (payload: UserRegistration) => axios.post(`${apiUrl()}${USER_API_URL}/registration`, payload),
};

export const useGetAllUsersQuery = () => {
  return useQuery([USER_QUERY_KEY], usersApi.getAllUsers);
};

export const useGetUserById = (id: string) => {
  return useQuery([GET_MY_DATA], () => usersApi.getUserById(id), {enabled: !!id});
};

export const useEditUserMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(usersApi.editUser, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([CURRENT_USER_QUERY_KEY]);
      queryClient.invalidateQueries([USER_QUERY_KEY]);
      queryClient.invalidateQueries([TOKEN_QUERY_KEY]);
      queryClient.invalidateQueries([TOKEN_REFRESH_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useGetTokenQuery = (email: string, pass: string, enabled: boolean) => {
  return useQuery([TOKEN_QUERY_KEY], () => usersApi.token(email, pass), { enabled: enabled });
};

export const useRefreshTokenQuery = (accessToken: string) => {
  return useQuery([TOKEN_REFRESH_QUERY_KEY], () => usersApi.refreshToken(accessToken));
};

export const useRegisterUserMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(usersApi.register, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([USER_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};

export const useDeleteUserMutation = (queryClient: QueryClient, options: Options) => {
  return useMutation(usersApi.deleteUser, {
    onSuccess: (response) => {
      options.onSuccess(response);
      queryClient.invalidateQueries([USER_QUERY_KEY]);
    },
    onError: (error) => {
      options.onError(error);
    }
  });
};
