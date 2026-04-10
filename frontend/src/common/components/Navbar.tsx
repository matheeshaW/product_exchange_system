import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold">Swapify</h1>

      <div className="flex gap-4">
        <Link to="/">Items</Link>
        <Link to="/swaps">Swaps</Link>

        {auth?.accessToken && (
          <>
            <Link to="/items/create">Create Item</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {!auth?.accessToken && (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        )}

        {auth?.accessToken && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;