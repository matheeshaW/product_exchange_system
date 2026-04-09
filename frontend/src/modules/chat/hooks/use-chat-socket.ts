import { useEffect } from 'react';
import { getSocket } from '../socket/socket.client';
import type { Message } from '../types/chat.types';

export const useChatSocket = (
  swapId: string,
  onMessage: (msg: Message) => void,
) => {
  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.emit('join_swap', swapId);

    socket.on('receive_message', onMessage);

    return () => {
      socket.off('receive_message', onMessage);
      socket.disconnect();
    };
  }, [swapId]);
};