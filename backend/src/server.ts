import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { initializeSocketHandlers } from './socket/socketHandler';

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    const io = new Server(httpServer, {
      cors: {
        origin: FRONTEND_URL,
        credentials: true
      }
    });

    // Store io instance globally for use in controllers
    (global as any).io = io;

    // Initialize socket handlers
    initializeSocketHandlers(io);

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io ready for connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
