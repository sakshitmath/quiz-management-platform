import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

const PIE_COLORS = ['#16a34a', '#dc2626'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [popularity, setPopularity] = useState([]);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => setStats(res.data));
    api.get('/admin/quiz-popularity').then((res) => setPopularity(res.data));
  }, []);

  const cards = stats ? [
    { label: 'Total Students', value: stats.totalStudents },
    { label: 'Total Quizzes', value: stats.totalQuizzes },
    { label: 'Published', value: stats.publishedQuizzes },
    { label: 'Draft', value: stats.draftQuizzes },
    { label: 'Total Questions', value: stats.totalQuestions },
    { label: 'Total Attempts', value: stats.totalAttempts },
    { label: 'Average Score', value: `${stats.averageScore}%` },
    { label: 'Passed', value: stats.passedAttempts },
    { label: 'Failed', value: stats.failedAttempts },
  ] : [];

  const pieData = stats ? [
    { name: 'Passed', value: stats.passedAttempts },
    { name: 'Failed', value: stats.failedAttempts },
  ] : [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {!stats && <p className="text-slate-500">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats && stats.totalAttempts > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="font-medium text-slate-700 mb-3">Pass / Fail Ratio</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {popularity.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="font-medium text-slate-700 mb-3">Most Attempted Quizzes</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={popularity} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="quizTitle" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="attemptCount" fill="#1e293b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}