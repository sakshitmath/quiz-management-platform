import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../api/axios';

const COLORS = ['#16a34a', '#dc2626'];

export default function StudentStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/attempts/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading...</div>;
  }

  const pieData = [
    { name: 'Passed', value: stats.totalPassed },
    { name: 'Failed', value: stats.totalFailed },
  ];

  const cards = [
    { label: 'Quizzes Attempted', value: stats.totalAttempted },
    { label: 'Passed', value: stats.totalPassed },
    { label: 'Failed', value: stats.totalFailed },
    { label: 'Average Score', value: `${stats.averageScore}%` },
    { label: 'Highest Score', value: `${stats.highestScore}%` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/student/dashboard" className="text-sm text-slate-500 hover:text-slate-800 underline">
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-6">My Performance</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-2xl font-bold text-slate-800">{c.value}</p>
              <p className="text-xs text-slate-500">{c.label}</p>
            </div>
          ))}
        </div>

        {stats.totalAttempted > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 mb-8">
            <h2 className="font-medium text-slate-700 mb-3">Pass / Fail Ratio</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 divide-y">
          <h2 className="font-medium text-slate-700 px-5 py-3">Recent Attempts</h2>
          {stats.recentAttempts.map((a) => (
            <div key={a.attemptId} className="flex justify-between items-center px-5 py-3">
              <div>
                <p className="font-medium text-slate-800">{a.quizTitle}</p>
                <p className="text-xs text-slate-400">{new Date(a.completedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{a.percentage}%</p>
                <p className={`text-xs font-medium ${a.status === 'COMPLETED' && a.percentage >= 60 ? 'text-green-600' : 'text-slate-500'}`}>
                  {a.status}
                </p>
              </div>
            </div>
          ))}
          {stats.recentAttempts.length === 0 && (
            <p className="text-slate-500 px-5 py-4">No attempts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}