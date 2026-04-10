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
    <div className="mx-auto max-w-4xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Conversation</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Swap Chat</h1>
        <p className="mt-1 text-sm text-slate-600">
          Coordinate item handover and finalize your swap details here.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ChatWindow messages={messages} />
        <MessageInput swapId={swapId} />
      </section>
    </div>
  );
};

export default ChatPage;