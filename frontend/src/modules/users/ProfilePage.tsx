import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../common/api/axios.instance';
import type { ApiResponse } from '../../common/api/api.types';
import Spinner from '../../common/components/Spinner';
import { AuthContext } from '../../context/AuthContext';

interface ProfileData {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string | null;
  phone: string | null;
  province: string | null;
  district: string | null;
}

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setError(null);
      const res = await api.get<ApiResponse<ProfileData>>('/users/me');
      const data = res.data.data;
      setProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
      setProvince(data.province || '');
      setDistrict(data.district || '');
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      setError(null);
      setProfileMessage(null);

      const res = await api.patch<ApiResponse<ProfileData>>('/users/me', {
        name,
        phone,
        province,
        district,
      });

      setProfile(res.data.data);
      setProfileMessage('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Please fill all password fields');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordMessage('New password must be different from current password');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to change your password?');
    if (!confirmed) return;

    try {
      setError(null);
      setPasswordMessage(null);

      await api.patch('/users/me/password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Password updated successfully');
    } catch {
      setPasswordMessage('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteMessage('Type DELETE to confirm account deletion');
      return;
    }

    if (!deletePassword) {
      setDeleteMessage('Please enter your password to confirm account deletion');
      return;
    }

    const confirmed = window.confirm(
      'This will permanently disable your account (soft delete). This action cannot be easily undone. Continue?',
    );

    if (!confirmed) return;

    try {
      setError(null);
      setDeleteMessage(null);

      await api.delete('/users/me', {
        data: { password: deletePassword },
      });

      auth?.logout();
      navigate('/login');
    } catch {
      setDeleteMessage('Failed to delete account. Check your password and try again.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <section className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Profile Information</h2>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{profile?.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium">{profile?.role}</p>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {profileMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
            {profileMessage}
          </div>
        )}

        <button
          onClick={handleProfileUpdate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </section>

      <section className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
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

        {passwordMessage && (
          <div className="bg-gray-100 text-gray-700 p-2 rounded text-sm">
            {passwordMessage}
          </div>
        )}

        <button
          onClick={handlePasswordChange}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </section>

      <section className="bg-white border border-red-200 rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-red-700">Delete Account</h2>
        <p className="text-sm text-gray-600">
          This will soft-delete your account. Type <strong>DELETE</strong> and enter your password to confirm.
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
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {deleteMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {deleteMessage}
          </div>
        )}

        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete My Account
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
