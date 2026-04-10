import { Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/LoginPage';
import RegisterPage from '../modules/auth/RegisterPage';
import ItemsPage from '../modules/items/ItemsPage';
import ItemDetailsPage from '../modules/items/ItemDetailsPage';
import CreateItemPage from '../modules/items/CreateItemPage';
import SwapsPage from '../modules/swaps/SwapsPage';
import ChatPage from '../modules/chat/ChatPage';
import ProfilePage from '../modules/users/ProfilePage';
import AuthGuard from '../common/guards/AuthGuard';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<ItemsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/items/:id" element={<ItemDetailsPage />} />
      <Route
        path="/items/create"
        element={
          <AuthGuard>
            <CreateItemPage />
          </AuthGuard>
        }
      />
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
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />
    </Routes>
  );
};

export default Router;