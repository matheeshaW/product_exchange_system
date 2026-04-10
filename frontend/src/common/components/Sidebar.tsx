import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(auth?.accessToken);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-sm">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-left"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
          S
        </span>
        <span>
          <p className="text-sm font-semibold text-slate-900">Swapify</p>
          <p className="text-xs text-slate-500">Community Exchange</p>
        </span>
      </button>

      <nav className="space-y-1">
        <NavLink to="/" className={navLinkClass} end>
          Browse Items
        </NavLink>
        <NavLink to="/swaps" className={navLinkClass}>
          Swaps
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink to="/items/create" className={navLinkClass}>
              Create Item
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;