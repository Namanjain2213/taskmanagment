import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { authenticate } from '../middleware/auth';

const router = Router();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.use(authenticate);

router.get('/', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markAsRead);

export default router;
