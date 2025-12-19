import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { TaskRepository } from '../repositories/TaskRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../dto/task.dto';

const router = Router();
const taskRepository = new TaskRepository();
const notificationRepository = new NotificationRepository();
const taskService = new TaskService(taskRepository, notificationRepository);
const taskController = new TaskController(taskService);

router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
