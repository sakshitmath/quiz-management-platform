import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AttemptHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attempts')
      .then((res) => setAttempts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/student/dashboard" className="text-sm text-slate-500 hover:text-slate-800 underline">
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-6">Attempt History</h1>

        {loading && <p className="text-slate-500">Loading...</p>}
        {!loading && attempts.length === 0 && <p className="text-slate-500">No attempts yet.</p>}

        <div className="space-y-3">
          {attempts.map((a) => (
            <Link
              key={a.attemptId}
              to={`/student/attempt/${a.attemptId}/review`}
              className="block bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{a.quizTitle}</p>
                  <p className="text-xs text-slate-400">{new Date(a.completedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{a.percentage}%</p>
                  <p className={`text-xs font-medium ${a.status === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
                    {a.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}