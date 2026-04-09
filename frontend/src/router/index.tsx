import { Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/LoginPage';
import ItemsPage from '../modules/items/ItemsPage';
import ItemDetailsPage from '../modules/items/ItemDetailsPage';
import SwapsPage from '../modules/swaps/SwapsPage';
import ChatPage from '../modules/chat/ChatPage';
import AuthGuard from '../common/guards/AuthGuard';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthGuard><ItemsPage /></AuthGuard>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/items/:id" element={<AuthGuard><ItemDetailsPage /></AuthGuard>} />
      <Route
        path="/swaps"
        element={
          <AuthGuard>
            <SwapsPage />
          </AuthGuard>
        }
      />
      <Route
        path="/chat/:swapId"
        element={
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
};

export default Router;