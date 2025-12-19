import { useState } from 'react';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const { tasks: myTasks, isLoading: loadingMy } = useTasks({ assignedToId: user?._id });
  const { tasks: createdTasks, isLoading: loadingCreated } = useTasks({ creatorId: user?._id });
  const { tasks: overdueTasks, isLoading: loadingOverdue } = useTasks({ overdue: true });
  const { createTask, updateTask, deleteTask } = useTasks();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreateTask = async (data: any) => {
    await createTask(data);
    setIsModalOpen(false);
  };

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

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Task
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              My Tasks ({myTasks.length})
            </h2>
            {loadingMy ? (
              <LoadingSkeleton />
            ) : myTasks.length === 0 ? (
              <p className="text-gray-500">No tasks assigned to you</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overdue Tasks ({overdueTasks.length})
            </h2>
            {loadingOverdue ? (
              <LoadingSkeleton />
            ) : overdueTasks.length === 0 ? (
              <p className="text-gray-500">No overdue tasks</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Created by Me ({createdTasks.length})
            </h2>
            {loadingCreated ? (
              <LoadingSkeleton />
            ) : createdTasks.length === 0 ? (
              <p className="text-gray-500">You haven't created any tasks yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

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
