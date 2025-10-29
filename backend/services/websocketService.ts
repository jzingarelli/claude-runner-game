/**
 * WebSocket Service
 * Real-time communication using Socket.IO
 */

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';
import logger from '../utils/logger';

/**
 * WebSocket service class
 */
class WebSocketService {
  private io: Server | null = null;
  private connectedUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  /**
   * Initialize WebSocket server
   * @param httpServer - HTTP server instance
   */
  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.WEBSOCKET_CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
      path: '/socket.io',
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
        socket.data.userId = decoded.userId;
        socket.data.email = decoded.email;
        socket.data.role = decoded.role;

        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });

    logger.info('WebSocket server initialized');
  }

  /**
   * Handle new connection
   */
  private handleConnection(socket: Socket): void {
    const userId = socket.data.userId as string;

    // Track connected user
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(socket.id);

    logger.info(`User connected: ${userId} (${socket.id})`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle user joining team room
    socket.on('join:team', (teamId: string) => {
      socket.join(`team:${teamId}`);
      logger.info(`User ${userId} joined team room: ${teamId}`);
    });

    // Handle user leaving team room
    socket.on('leave:team', (teamId: string) => {
      socket.leave(`team:${teamId}`);
      logger.info(`User ${userId} left team room: ${teamId}`);
    });

    // Handle notification acknowledgment
    socket.on('notification:read', (notificationId: string) => {
      logger.info(`Notification read: ${notificationId} by ${userId}`);
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { postId: string }) => {
      socket.to(`post:${data.postId}`).emit('typing:start', {
        userId,
        postId: data.postId,
      });
    });

    socket.on('typing:stop', (data: { postId: string }) => {
      socket.to(`post:${data.postId}`).emit('typing:stop', {
        userId,
        postId: data.postId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });

    // Handle errors
    socket.on('error', (error: Error) => {
      logger.error('Socket error:', error);
    });

    // Emit connection success
    socket.emit('connected', { userId, socketId: socket.id });
  }

  /**
   * Handle disconnection
   */
  private handleDisconnection(socket: Socket): void {
    const userId = socket.data.userId as string;

    // Remove from connected users
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        this.connectedUsers.delete(userId);
      }
    }

    logger.info(`User disconnected: ${userId} (${socket.id})`);
  }

  /**
   * Send notification to user
   * @param userId - User ID
   * @param notification - Notification data
   */
  sendNotification(userId: string, notification: unknown): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('notification', notification);
    logger.info(`Notification sent to user: ${userId}`);
  }

  /**
   * Send notification to team
   * @param teamId - Team ID
   * @param notification - Notification data
   */
  sendTeamNotification(teamId: string, notification: unknown): void {
    if (!this.io) return;

    this.io.to(`team:${teamId}`).emit('notification', notification);
    logger.info(`Notification sent to team: ${teamId}`);
  }

  /**
   * Broadcast analytics update
   * @param userId - User ID
   * @param data - Analytics data
   */
  broadcastAnalyticsUpdate(userId: string, data: unknown): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('analytics:update', data);
  }

  /**
   * Broadcast post update
   * @param postId - Post ID
   * @param data - Post data
   */
  broadcastPostUpdate(postId: string, data: unknown): void {
    if (!this.io) return;

    this.io.to(`post:${postId}`).emit('post:update', data);
  }

  /**
   * Broadcast comment added
   * @param postId - Post ID
   * @param comment - Comment data
   */
  broadcastCommentAdded(postId: string, comment: unknown): void {
    if (!this.io) return;

    this.io.to(`post:${postId}`).emit('comment:added', comment);
  }

  /**
   * Broadcast report ready
   * @param userId - User ID
   * @param report - Report data
   */
  broadcastReportReady(userId: string, report: unknown): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('report:ready', report);
  }

  /**
   * Check if user is online
   * @param userId - User ID
   * @returns Boolean indicating if user is online
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.connectedUsers.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  /**
   * Get online users count
   * @returns Number of online users
   */
  getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get connected sockets for user
   * @param userId - User ID
   * @returns Set of socket IDs
   */
  getUserSockets(userId: string): Set<string> {
    return this.connectedUsers.get(userId) || new Set();
  }

  /**
   * Close WebSocket server
   */
  close(): void {
    if (this.io) {
      this.io.close();
      this.connectedUsers.clear();
      logger.info('WebSocket server closed');
    }
  }
}

export default new WebSocketService();
