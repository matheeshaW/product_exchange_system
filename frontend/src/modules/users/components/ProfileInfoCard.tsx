import { useEffect, useState } from 'react';
import type { ProfileData, UpdateProfilePayload } from '../types/user.types';

interface Props {
  profile: ProfileData;
  onSave: (payload: UpdateProfilePayload) => Promise<ProfileData>;
}

const ProfileInfoCard = ({ profile, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [province, setProvince] = useState(profile.province || '');
  const [district, setDistrict] = useState(profile.district || '');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setProvince(profile.province || '');
    setDistrict(profile.district || '');
  }, [profile]);

  const handleCancel = () => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setProvince(profile.province || '');
    setDistrict(profile.district || '');
    setMessage(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      await onSave({
        name,
        phone,
        province,
        district,
      });

      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile Information</h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Edit Info
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-medium">{profile.email}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Role</p>
        <p className="font-medium">{profile.role}</p>
      </div>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!isEditing}
        className="w-full border p-2 rounded disabled:bg-gray-50"
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={!isEditing}
        className="w-full border p-2 rounded disabled:bg-gray-50"
      />

      <input
        type="text"
        placeholder="Province"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        disabled={!isEditing}
        className="w-full border p-2 rounded disabled:bg-gray-50"
      />

      <input
        type="text"
        placeholder="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        disabled={!isEditing}
        className="w-full border p-2 rounded disabled:bg-gray-50"
      />

      {message && (
        <div className="bg-gray-100 text-gray-700 p-2 rounded text-sm">
          {message}
        </div>
      )}
    </section>
  );
};

export default ProfileInfoCard;
