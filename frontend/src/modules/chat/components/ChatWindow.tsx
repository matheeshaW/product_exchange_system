import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import MessageBubble from './MessageBubble';
import type { Message } from '../types/chat.types';

interface Props {
  messages: Message[];
}

const ChatWindow = ({ messages }: Props) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;

  return (
    <div className="flex flex-col gap-2 p-4 h-[400px] overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          isMine={msg.senderId === userId}
        />
      ))}
    </div>
  );
};

export default ChatWindow;