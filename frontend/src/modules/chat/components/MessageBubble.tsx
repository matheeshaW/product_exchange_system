import type { Message } from '../types/chat.types';

interface Props {
  msg: Message;
  isMine: boolean;
}

const MessageBubble = ({ msg, isMine }: Props) => {
  const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[70%] ${
          isMine
            ? 'bg-slate-900 text-white rounded-br-md'
            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{msg.message}</p>
        <p className={`mt-1 text-[11px] ${isMine ? 'text-slate-300' : 'text-slate-500'}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;