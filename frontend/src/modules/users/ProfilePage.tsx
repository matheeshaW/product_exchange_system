import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../common/components/Spinner';
import { AuthContext } from '../../context/AuthContext';
import ChangePasswordModal from './components/ChangePasswordModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import MyItemsSection from './components/MyItemsSection';
import ProfileInfoCard from './components/ProfileInfoCard';
import { useMyItems } from './hooks/use-my-items';
import { useProfile } from './hooks/use-profile';

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    profile,
    loading,
    error,
    saveProfile,
    changePassword,
    deleteAccount,
  } = useProfile();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    savingId,
    deletingId,
    saveItem,
    removeItem,
  } = useMyItems();

  const handleDeleteAccount = async (payload: { password: string }) => {
    await deleteAccount(payload);
    auth?.logout();
    navigate('/login');
  };

  if (loading) return <Spinner />;

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error || 'Profile data unavailable'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <ProfileInfoCard
        profile={profile}
        onSave={saveProfile}
      />

      <section className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-gray-600">
          Manage your password and account status.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
        </div>
      </section>

      <MyItemsSection
        items={items}
        loading={itemsLoading}
        error={itemsError}
        savingId={savingId}
        deletingId={deletingId}
        onSave={saveItem}
        onDelete={removeItem}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={changePassword}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfilePage;
