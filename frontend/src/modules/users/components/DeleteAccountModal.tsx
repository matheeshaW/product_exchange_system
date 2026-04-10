import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { password: string }) => Promise<void>;
}

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [password, setPassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPassword('');
    setDeleteConfirm('');
    setMessage(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') {
      setMessage('Type DELETE to confirm account deletion');
      return;
    }

    if (!password) {
      setMessage('Please enter your password');
      return;
    }

    const confirmed = window.confirm(
      'This will soft-delete your account. This action cannot be easily undone. Continue?',
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage(null);
      await onConfirm({ password });
    } catch {
      setMessage('Failed to delete account. Check your password and try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-5 space-y-3 border border-red-200">
        <h2 className="text-lg font-semibold text-red-700">Delete Account</h2>

        <p className="text-sm text-gray-600">
          This will soft-delete your account. Type <strong>DELETE</strong> and enter your password.
        </p>

        <input
          type="text"
          placeholder="Type DELETE"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {message && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{message}</div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
