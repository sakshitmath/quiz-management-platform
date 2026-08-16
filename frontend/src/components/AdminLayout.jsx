import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/categories', label: 'Categories' },
  { path: '/admin/quizzes', label: 'Quizzes' },
  { path: '/admin/users', label: 'Students' },
  { path: '/leaderboard', label: 'Leaderboard' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-slate-800 text-white p-5 flex flex-col">
        <h2 className="font-bold text-lg mb-1">Quiz Admin</h2>
        <p className="text-slate-400 text-sm mb-6">{user?.name}</p>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded text-sm ${
                location.pathname === item.path
                  ? 'bg-slate-700 font-medium'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="text-sm text-slate-400 hover:text-white text-left"
        >
          Log out
        </button>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}