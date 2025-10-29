import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function initWebSocket(server: HttpServer): void {
  io = new SocketIOServer(server, {
    cors: { origin: process.env.CLIENT_URL || '*', credentials: true },
  });
}

export function emitNotification(userId: string, payload: unknown): void {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification', payload);
}

export function bindUserSocket(userId: string, socketId: string): void {
  if (!io) return;
  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    socket.join(`user:${userId}`);
  }
}
