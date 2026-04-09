import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const auth = useContext(AuthContext);

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
