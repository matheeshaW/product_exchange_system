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
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
          {error || 'Profile data unavailable'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Account</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your personal details, security settings, and item listings in one place.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProfileInfoCard
            profile={profile}
            onSave={saveProfile}
          />

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Security</h2>
            <p className="text-sm text-slate-600">
              Manage your password and account status.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
              >
                Change Password
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>

        <MyItemsSection
          items={items}
          loading={itemsLoading}
          error={itemsError}
          savingId={savingId}
          deletingId={deletingId}
          onSave={saveItem}
          onDelete={removeItem}
        />
      </div>

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
