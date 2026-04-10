import { useEffect } from 'react';
import { getSocket } from '../socket/socket.client';
import type { Message } from '../types/chat.types';
import { getAxiosAccessToken } from '../../../common/api/axios.instance';

export const useChatSocket = (
  swapId: string,
  onMessage: (msg: Message) => void,
) => {
  useEffect(() => {
    if (!swapId) {
      return;
    }

    const socket = getSocket();

    socket.auth = {
      token: getAxiosAccessToken(),
    };

    socket.connect();

    socket.emit('join_swap', swapId);

    socket.on('receive_message', onMessage);

    return () => {
      socket.off('receive_message', onMessage);
      socket.disconnect();
    };
  }, [swapId]);
};