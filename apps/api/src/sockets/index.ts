import type { Server, Socket } from 'socket.io';

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    socket.on('join', (room: string) => socket.join(room));
    socket.on('disconnect', () => {
      // cleanup
    });
  });
}
