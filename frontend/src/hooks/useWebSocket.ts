import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket(path = '/') {
  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(path);
    ref.current = socket;
    return () => {
      socket.disconnect();
    };
  }, [path]);

  return ref;
}
