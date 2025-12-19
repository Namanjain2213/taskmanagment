export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: User;
  assignedToId?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  taskId: {
    _id: string;
    title: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  assignedToId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string | null;
}
