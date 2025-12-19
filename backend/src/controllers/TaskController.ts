import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TaskService } from '../services/TaskService';
import { TaskStatus, TaskPriority } from '../models/Task';

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.createTask(req.userId!, req.body);
      res.status(201).json({
        success: true,
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      res.status(200).json({
        success: true,
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  };

  getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: any = {};
      
      if (req.query.status) filters.status = req.query.status as TaskStatus;
      if (req.query.priority) filters.priority = req.query.priority as TaskPriority;
      if (req.query.creatorId) filters.creatorId = req.query.creatorId as string;
      if (req.query.assignedToId) filters.assignedToId = req.query.assignedToId as string;
      if (req.query.overdue === 'true') filters.overdue = true;

      const sort = req.query.sortBy ? {
        field: req.query.sortBy as any,
        order: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      } : undefined;

      const tasks = await this.taskService.getAllTasks(filters, sort);
      res.status(200).json({
        success: true,
        data: { tasks }
      });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.updateTask(req.params.id, req.body, req.userId!);
      res.status(200).json({
        success: true,
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.taskService.deleteTask(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
