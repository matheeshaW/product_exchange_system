import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getAxiosAccessToken } from '../../../common/api/axios.instance';
import MessageBubble from './MessageBubble';
import type { Message } from '../types/chat.types';
import EmptyState from '../../../common/components/EmptyState';

interface Props {
  messages: Message[];
}

const ChatWindow = ({ messages }: Props) => {
  const auth = useContext(AuthContext);
  let userId = auth?.user?.id;

  if (!userId) {
    const token = getAxiosAccessToken();

    if (token) {
      try {
        const payloadPart = token.split('.')[1];
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const payload = JSON.parse(atob(padded));
        userId = payload.sub;
      } catch {
        userId = undefined;
      }
    }
  }
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[460px] flex-col gap-3 overflow-y-auto bg-slate-50/70 p-4 sm:p-5">
      {messages.length === 0 && (
        <EmptyState message="No messages yet. Start the conversation." />
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          isMine={msg.senderId === userId}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;