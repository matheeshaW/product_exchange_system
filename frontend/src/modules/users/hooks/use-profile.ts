import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../common/api/error-message';
import {
  changeMyPassword,
  deleteMyAccount,
  fetchMyProfile,
  updateMyProfile,
} from '../services/users.service';
import type {
  ChangePasswordPayload,
  DeleteAccountPayload,
  ProfileData,
  UpdateProfilePayload,
} from '../types/user.types';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchMyProfile();
      setProfile(data);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to load profile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const updated = await updateMyProfile(payload);
    setProfile(updated);
    return updated;
  }, []);

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    await changeMyPassword(payload);
  }, []);

  const deleteAccount = useCallback(async (payload: DeleteAccountPayload) => {
    await deleteMyAccount(payload);
  }, []);

  return {
    profile,
    loading,
    error,
    setError,
    reloadProfile: loadProfile,
    saveProfile,
    changePassword,
    deleteAccount,
  };
};
