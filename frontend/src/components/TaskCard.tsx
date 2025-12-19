import { Task, TaskPriority, TaskStatus } from '../types';
import { format, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-800'
};

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.REVIEW]: 'bg-yellow-100 text-yellow-800',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800'
};

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== TaskStatus.COMPLETED;

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
        {isOverdue && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Overdue
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex items-center">
          <span className="font-medium mr-2">Due:</span>
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        </div>
        {task.assignedToId && (
          <div className="flex items-center">
            <span className="font-medium mr-2">Assigned to:</span>
            <span>{task.assignedToId.name}</span>
          </div>
        )}
        <div className="flex items-center">
          <span className="font-medium mr-2">Created by:</span>
          <span>{task.creatorId.name}</span>
        </div>
      </div>
    </div>
  );
};
