import { TaskRepository, TaskFilters, TaskSort } from '../repositories/TaskRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { NotFoundError, ValidationError } from '../utils/errors';
import { ITask } from '../models/Task';
import mongoose from 'mongoose';

/**
 * Business logic for task management
 * Handles task CRUD operations and notification creation
 */
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private notificationRepository: NotificationRepository
  ) {}

  /**
   * Create a new task
   * @param userId - ID of user creating the task
   * @param data - Task creation data
   * @returns Created task
   */
  async createTask(userId: string, data: CreateTaskDto): Promise<ITask> {
    // Validate due date is in the future
    const dueDate = new Date(data.dueDate);
    if (dueDate < new Date()) {
      throw new ValidationError('Due date must be in the future');
    }

    const taskData: any = {
      ...data,
      dueDate,
      creatorId: userId
    };

    if (data.assignedToId) {
      taskData.assignedToId = data.assignedToId;
    }

    const task = await this.taskRepository.create(taskData);

    // Emit socket event for real-time update
    const io = (global as any).io;
    if (io) {
      const { emitTaskCreated, emitTaskAssigned } = require('../socket/socketHandler');
      emitTaskCreated(io, task);
    }

    // Create notification if task is assigned
    if (data.assignedToId && data.assignedToId !== userId) {
      const notification = await this.notificationRepository.create({
        userId: data.assignedToId,
        taskId: task._id.toString(),
        message: `You have been assigned a new task: "${task.title}"`
      });

      if (io) {
        const { emitTaskAssigned } = require('../socket/socketHandler');
        emitTaskAssigned(io, data.assignedToId, notification);
      }
    }

    return task;
  }

  /**
   * Get task by ID
   * @param taskId - Task ID
   * @returns Task data
   */
  async getTaskById(taskId: string): Promise<ITask> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new ValidationError('Invalid task ID');
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  /**
   * Get all tasks with optional filters and sorting
   * @param filters - Filter criteria
   * @param sort - Sort configuration
   * @returns List of tasks
   */
  async getAllTasks(filters: TaskFilters = {}, sort?: TaskSort): Promise<ITask[]> {
    return await this.taskRepository.findAll(filters, sort);
  }

  /**
   * Update task by ID
   * @param taskId - Task ID
   * @param data - Update data
   * @param userId - ID of user performing update (for notifications)
   * @returns Updated task
   */
  async updateTask(taskId: string, data: UpdateTaskDto, userId: string): Promise<ITask> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new ValidationError('Invalid task ID');
    }

    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    // Validate due date if provided
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (dueDate < new Date()) {
        throw new ValidationError('Due date must be in the future');
      }
    }

    const updateData: any = { ...data };
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    const task = await this.taskRepository.updateById(taskId, updateData);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Emit socket event for real-time update
    const io = (global as any).io;
    if (io) {
      const { emitTaskUpdated, emitTaskAssigned } = require('../socket/socketHandler');
      emitTaskUpdated(io, task);
    }

    // Create notification if assignee changed
    if (
      data.assignedToId !== undefined &&
      data.assignedToId !== existingTask.assignedToId?.toString() &&
      data.assignedToId !== userId
    ) {
      if (data.assignedToId) {
        const notification = await this.notificationRepository.create({
          userId: data.assignedToId,
          taskId: task._id.toString(),
          message: `You have been assigned to task: "${task.title}"`
        });

        if (io) {
          const { emitTaskAssigned } = require('../socket/socketHandler');
          emitTaskAssigned(io, data.assignedToId, notification);
        }
      }
    }

    return task;
  }

  /**
   * Delete task by ID
   * @param taskId - Task ID
   */
  async deleteTask(taskId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new ValidationError('Invalid task ID');
    }

    const task = await this.taskRepository.deleteById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Emit socket event for real-time update
    const io = (global as any).io;
    if (io) {
      const { emitTaskDeleted } = require('../socket/socketHandler');
      emitTaskDeleted(io, taskId);
    }
  }
}
