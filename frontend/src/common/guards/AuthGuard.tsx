import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import type { ReactNode } from 'react';
import Spinner from '../components/Spinner';

interface Props {
  children: ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const auth = useContext(AuthContext);

  if (auth?.isAuthLoading) {
    return <Spinner />;
  }

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
