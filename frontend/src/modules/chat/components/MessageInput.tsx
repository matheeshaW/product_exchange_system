import { useState } from 'react';
import { getSocket } from '../socket/socket.client';

interface Props {
  swapId: string;
}

const MessageInput = ({ swapId }: Props) => {
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text.trim()) return;

    const socket = getSocket();

    socket.emit('send_message', {
      swapId,
      message: text,
    });

    setText('');
  };

  return (
    <div className="flex gap-2 p-2 border-t">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border p-2 rounded"
        placeholder="Type a message..."
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;