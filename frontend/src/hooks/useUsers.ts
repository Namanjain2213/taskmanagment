import useSWR from 'swr';
import { api } from '../services/api';
import { User } from '../types';

export const useUsers = () => {
  const { data, error } = useSWR<{ users: User[] }>(
    '/users',
    () => api.get('/users'),
    {
      revalidateOnFocus: false
    }
  );

  return {
    users: data?.users || [],
    isLoading: !error && !data,
    isError: error
  };
};
