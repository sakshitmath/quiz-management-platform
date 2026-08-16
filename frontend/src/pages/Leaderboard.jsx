import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then((res) => setEntries(res.data)).finally(() => setLoading(false));
  }, []);

  const backLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

  const medalColor = (rank) => {
    if (rank === 0) return 'bg-yellow-100 text-yellow-700';
    if (rank === 1) return 'bg-slate-200 text-slate-600';
    if (rank === 2) return 'bg-orange-100 text-orange-700';
    return 'bg-slate-50 text-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-xl mx-auto">
        <Link to={backLink} className="text-sm text-slate-500 hover:text-slate-800 underline">
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-6">Leaderboard</h1>

        {loading && <p className="text-slate-500">Loading...</p>}
        {!loading && entries.length === 0 && <p className="text-slate-500">No results yet.</p>}

        <div className="bg-white rounded-lg border border-slate-200 divide-y">
          {entries.map((entry, i) => (
            <div key={entry.userId} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${medalColor(i)}`}>
                  {i + 1}
                </span>
                <span className="font-medium text-slate-800">{entry.name}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{entry.averageScore}%</p>
                <p className="text-xs text-slate-400">{entry.quizzesCompleted} quizzes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}