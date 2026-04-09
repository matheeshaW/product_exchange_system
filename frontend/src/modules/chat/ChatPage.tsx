import { useParams } from 'react-router-dom';
import { useChatHistory } from './hooks/use-chat-history';
import { useChatSocket } from './hooks/use-chat-socket';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

const ChatPage = () => {
  const { swapId } = useParams<{ swapId: string }>();

  if (!swapId) return <div>Invalid swap</div>;

  const { messages, setMessages } = useChatHistory(swapId);

  useChatSocket(swapId, (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Chat</h1>

      <ChatWindow messages={messages} />

      <MessageInput swapId={swapId} />
    </div>
  );
};

export default ChatPage;