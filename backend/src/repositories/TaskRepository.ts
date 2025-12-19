import Task, { ITask, TaskStatus, TaskPriority } from '../models/Task';
import mongoose from 'mongoose';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  creatorId?: string;
  assignedToId?: string;
  overdue?: boolean;
}

export interface TaskSort {
  field: 'dueDate' | 'createdAt' | 'priority';
  order: 'asc' | 'desc';
}

/**
 * Data access layer for Task operations
 */
export class TaskRepository {
  async create(data: Partial<ITask>): Promise<ITask> {
    return await Task.create(data);
  }

  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id)
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  async findAll(filters: TaskFilters = {}, sort?: TaskSort): Promise<ITask[]> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.creatorId) query.creatorId = filters.creatorId;
    if (filters.assignedToId) query.assignedToId = filters.assignedToId;
    if (filters.overdue) {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: TaskStatus.COMPLETED };
    }

    let queryBuilder = Task.find(query)
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');

    if (sort) {
      const sortOrder = sort.order === 'asc' ? 1 : -1;
      queryBuilder = queryBuilder.sort({ [sort.field]: sortOrder });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    return await queryBuilder;
  }

  async updateById(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  async deleteById(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await Task.countDocuments({ _id: id });
    return count > 0;
  }
}
