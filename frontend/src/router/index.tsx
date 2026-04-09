import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/LoginPage';
import ItemsPage from '../modules/items/ItemsPage';
import ItemDetailsPage from '../modules/items/ItemDetailsPage';
import SwapsPage from '../modules/swaps/SwapsPage';
import ChatPage from '../modules/chat/ChatPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/swaps" element={<SwapsPage />} />
        <Route path="/chat/:swapId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;