import useSWR from 'swr';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Task, CreateTaskData, UpdateTaskData, TaskStatus, TaskPriority } from '../types';
import { socketService } from '../services/socket';

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  creatorId?: string;
  assignedToId?: string;
  overdue?: boolean;
  sortBy?: 'dueDate' | 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export const useTasks = (filters?: TaskFilters) => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const endpoint = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const { data, error, mutate } = useSWR<{ tasks: Task[] }>(
    endpoint,
    () => api.get(endpoint),
    {
      revalidateOnFocus: false
    }
  );

  // Real-time updates
  useEffect(() => {
    const handleTaskCreated = (task: Task) => {
      mutate((current) => {
        if (!current) return current;
        return { tasks: [task, ...current.tasks] };
      }, false);
    };

    const handleTaskUpdated = (updatedTask: Task) => {
      mutate((current) => {
        if (!current) return current;
        return {
          tasks: current.tasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        };
      }, false);
    };

    const handleTaskDeleted = ({ taskId }: { taskId: string }) => {
      mutate((current) => {
        if (!current) return current;
        return {
          tasks: current.tasks.filter((task) => task._id !== taskId)
        };
      }, false);
    };

    socketService.on('task:created', handleTaskCreated);
    socketService.on('task:updated', handleTaskUpdated);
    socketService.on('task:deleted', handleTaskDeleted);

    return () => {
      socketService.off('task:created', handleTaskCreated);
      socketService.off('task:updated', handleTaskUpdated);
      socketService.off('task:deleted', handleTaskDeleted);
    };
  }, [mutate]);

  const createTask = async (data: CreateTaskData) => {
    try {
      const result = await api.post<{ task: Task }>('/tasks', data);
      // Optimistic update
      mutate((current) => {
        if (!current) return { tasks: [result.task] };
        return { tasks: [result.task, ...current.tasks] };
      }, false);
      toast.success('Task created successfully!');
      return result.task;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const result = await api.put<{ task: Task }>(`/tasks/${id}`, data);
      // Optimistic update
      mutate((current) => {
        if (!current) return current;
        return {
          tasks: current.tasks.map((task) =>
            task._id === id ? result.task : task
          )
        };
      }, false);
      toast.success('Task updated successfully!');
      return result.task;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      // Optimistic update
      mutate((current) => {
        if (!current) return current;
        return {
          tasks: current.tasks.filter((task) => task._id !== id)
        };
      }, false);
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
      throw error;
    }
  };

  return {
    tasks: data?.tasks || [],
    isLoading: !error && !data,
    isError: error,
    createTask,
    updateTask,
    deleteTask,
    mutate
  };
};
