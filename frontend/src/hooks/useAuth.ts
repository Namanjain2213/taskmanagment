import useSWR from 'swr';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { User } from '../types';
import { socketService } from '../services/socket';

interface AuthData {
  user: User;
  token: string;
}

export const useAuth = () => {
  const { data, error, mutate } = useSWR<{ user: User }>(
    '/auth/me',
    () => api.get('/auth/me'),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  const login = async (email: string, password: string) => {
    try {
      const result = await api.post<AuthData>('/auth/login', { email, password });
      socketService.connect(result.token);
      await mutate({ user: result.user });
      toast.success('Login successful!');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await api.post<AuthData>('/auth/register', { name, email, password });
      socketService.connect(result.token);
      await mutate({ user: result.user });
      toast.success('Account created successfully!');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      socketService.disconnect();
      await mutate(undefined, false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const updateProfile = async (name: string) => {
    try {
      const result = await api.put<{ user: User }>('/auth/profile', { name });
      await mutate(result);
      toast.success('Profile updated successfully!');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed');
      throw error;
    }
  };

  return {
    user: data?.user,
    isLoading: !error && !data,
    isError: error,
    login,
    register,
    logout,
    updateProfile,
    mutate
  };
};
