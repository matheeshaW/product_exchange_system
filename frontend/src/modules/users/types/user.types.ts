// USER
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

export interface ProfileData {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string | null;
  phone: string | null;
  province: string | null;
  district: string | null;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  province: string;
  district: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password: string;
}

