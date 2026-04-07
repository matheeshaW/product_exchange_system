import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/LoginPage';
import ItemsPage from '../modules/items/ItemsPage';
import ItemDetailsPage from '../modules/items/ItemDetailsPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;