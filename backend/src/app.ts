import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tasks', taskRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/notifications', notificationRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
};
