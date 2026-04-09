import type { Message } from '../types/chat.types';

interface Props {
  msg: Message;
  isMine: boolean;
}

const MessageBubble = ({ msg, isMine }: Props) => {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-3 py-2 rounded max-w-xs ${
          isMine ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {msg.message}
      </div>
    </div>
  );
};

export default MessageBubble;