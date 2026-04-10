import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(auth?.accessToken);

  const displayName = auth?.user?.name || auth?.user?.email?.split('@')[0] || 'Guest';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <nav className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white lg:hidden">
            S
          </span>
          <span>
            <p className="text-sm font-semibold text-slate-900">Swapify</p>
            <p className="text-xs text-slate-500">Trade smarter, waste less</p>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Items
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
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <span className="hidden rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 sm:inline-block">
              {displayName}
            </span>
          )}

          {!isLoggedIn ? (
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white transition hover:bg-slate-800"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white transition hover:bg-rose-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;