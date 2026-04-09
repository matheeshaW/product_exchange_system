import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold">Swapify</h1>

      <div className="flex gap-4">
        <Link to="/">Items</Link>
        <Link to="/swaps">Swaps</Link>
      </div>
    </nav>
  );
};

export default Navbar;