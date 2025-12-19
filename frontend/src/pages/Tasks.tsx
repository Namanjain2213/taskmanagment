import { useState } from 'react';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskStatus, TaskPriority } from '../types';

export const Tasks = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filters: any = {};
  if (statusFilter) filters.status = statusFilter;
  if (priorityFilter) filters.priority = priorityFilter;
  filters.sortBy = sortBy;
  filters.sortOrder = sortOrder;

  const { tasks, isLoading, updateTask, deleteTask } = useTasks(filters);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
      setEditingTask(undefined);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Tasks</h1>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              >
                <option value="">All Statuses</option>
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              >
                <option value="">All Priorities</option>
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'createdAt')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(undefined)}
          title="Edit Task"
        >
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(undefined)}
          />
        </Modal>
      </div>
    </Layout>
  );
};
