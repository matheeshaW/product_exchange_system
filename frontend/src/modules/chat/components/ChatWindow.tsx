import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import MessageBubble from './MessageBubble';
import type { Message } from '../types/chat.types';
import EmptyState from '../../../common/components/EmptyState';

interface Props {
  messages: Message[];
}

const ChatWindow = ({ messages }: Props) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2 p-4 h-[400px] overflow-y-auto">
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