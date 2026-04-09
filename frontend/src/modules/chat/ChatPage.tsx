import { useParams } from 'react-router-dom';
import Spinner from '../../common/components/Spinner';
import EmptyState from '../../common/components/EmptyState';
import { useChatHistory } from './hooks/use-chat-history';
import { useChatSocket } from './hooks/use-chat-socket';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

const ChatPage = () => {
  const { swapId } = useParams<{ swapId: string }>();
  const safeSwapId = swapId ?? '';

  const { messages, setMessages, loading, error } = useChatHistory(safeSwapId);

  useChatSocket(safeSwapId, (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  if (!swapId) return <div className="p-4">Invalid swap</div>;

  if (loading) return <Spinner />;

  if (error) return <EmptyState message={error} />;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Chat</h1>

      <ChatWindow messages={messages} />

      <MessageInput swapId={swapId} />
    </div>
  );
};

export default ChatPage;