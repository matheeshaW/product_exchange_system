import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const ChangePasswordModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill all password fields');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setMessage('New password must be different from current password');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to change your password?');
    if (!confirmed) return;

    try {
      setSaving(true);
      setMessage(null);
      await onConfirm({ currentPassword, newPassword });
      setMessage('Password updated successfully');
      setTimeout(() => onClose(), 600);
    } catch {
      setMessage('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-5 space-y-3">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {message && (
          <div className="bg-gray-100 text-gray-700 p-2 rounded text-sm">{message}</div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
