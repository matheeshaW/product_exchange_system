import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/LoginPage';
import ItemsPage from '../modules/items/ItemsPage'; 

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;