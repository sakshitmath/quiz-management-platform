import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin — {user?.name}</h1>
        <button
          onClick={logout}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Log out
        </button>
      </div>
      <p className="text-slate-500">Admin dashboard — quiz management coming next.</p>
    </div>
  );
}