import { useEffect, useState } from 'react';
import api from '../../../common/api/axios.instance';
import { getApiErrorMessage } from '../../../common/api/error-message';
import type { ApiResponse } from '../../../common/api/api.types';
import type { Message } from '../types/chat.types';

export const useChatHistory = (swapId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!swapId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<ApiResponse<Message[]>>(
          `/chat/${swapId}?page=1&limit=20`,
        );

        setMessages(res.data.data);
      } catch (error) {
        setError(getApiErrorMessage(error, 'Failed to load chat history'));
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [swapId]);

  return { messages, setMessages, loading, error };
};