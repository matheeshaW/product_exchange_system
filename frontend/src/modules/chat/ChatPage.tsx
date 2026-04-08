import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { swapId } = useParams<{ swapId: string }>();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Chat</h1>
      <p className="text-gray-600">Swap ID: {swapId}</p>
      <p className="mt-4 text-sm text-gray-500">
        Chat UI can be added here next.
      </p>
    </div>
  );
};

export default ChatPage;