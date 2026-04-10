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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 sm:p-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        placeholder="Type a message..."
      />

      <button
        onClick={sendMessage}
        disabled={!text.trim()}
        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;