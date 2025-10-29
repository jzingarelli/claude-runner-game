import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function Notifications() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket: Socket = io('/', { transports: ['websocket'] });
    socket.on('notification', (msg: unknown) => setMessages((m) => [...m, JSON.stringify(msg)]));
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Notifications</h2>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
