import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function NotificationsPage() {
  const socketRef = useWebSocket();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const handler = (msg: any) => console.log('Notification', msg);
    socket.on('notification', handler);
    return () => { socket.off('notification', handler); };
  }, [socketRef]);

  return (
    <div>
      <h2>Notification Center</h2>
      <p>Real-time updates will appear in the console.</p>
    </div>
  );
}
