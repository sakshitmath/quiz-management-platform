import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function AdminAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/attempts')
      .then((res) => setAttempts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">All Attempts</h1>

      {loading && <p className="text-slate-500">Loading...</p>}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Quiz</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attempts.map((a) => (
              <tr key={a.attemptId}>
                <td className="px-5 py-3">
                  <div className="text-slate-800 font-medium">{a.studentName}</div>
                  <div className="text-xs text-slate-400">{a.studentEmail}</div>
                </td>
                <td className="px-5 py-3 text-slate-600">{a.quizTitle}</td>
                <td className="px-5 py-3 text-slate-800 font-medium">{a.percentage}%</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    a.status === 'COMPLETED' && a.percentage >= 60
                      ? 'bg-green-100 text-green-700'
                      : a.status === 'EXPIRED'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && attempts.length === 0 && (
          <p className="text-slate-500 px-5 py-4">No attempts yet.</p>
        )}
      </div>
    </AdminLayout>
  );
}