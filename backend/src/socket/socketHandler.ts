import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

/**
 * Initialize Socket.io event handlers for real-time features
 * @param io - Socket.io server instance
 */
export const initializeSocketHandlers = (io: Server): void => {
  // Authentication middleware for socket connections
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(new Error('Invalid token'));
    }

    socket.userId = payload.userId;
    next();
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room for targeted notifications
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

/**
 * Emit task created event to all connected clients
 */
export const emitTaskCreated = (io: Server, task: any): void => {
  io.emit('task:created', task);
};

/**
 * Emit task updated event to all connected clients
 */
export const emitTaskUpdated = (io: Server, task: any): void => {
  io.emit('task:updated', task);
};

/**
 * Emit task deleted event to all connected clients
 */
export const emitTaskDeleted = (io: Server, taskId: string): void => {
  io.emit('task:deleted', { taskId });
};

/**
 * Emit task assigned notification to specific user
 */
export const emitTaskAssigned = (io: Server, userId: string, notification: any): void => {
  io.to(`user:${userId}`).emit('task:assigned', notification);
  io.to(`user:${userId}`).emit('notification:new', notification);
};
