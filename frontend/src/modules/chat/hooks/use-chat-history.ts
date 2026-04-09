import { useEffect, useState } from 'react';
import api from '../../../common/api/axios.instance';
import type { ApiResponse } from '../../../common/api/api.types';
import type { Message } from '../types/chat.types';

export const useChatHistory = (swapId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get<ApiResponse<Message[]>>(
        `/chat/${swapId}?page=1&limit=20`,
      );

      setMessages(res.data.data);
    };

    fetch();
  }, [swapId]);

  return { messages, setMessages };
};