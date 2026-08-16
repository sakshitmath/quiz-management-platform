import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => setStats(res.data));
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

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {!stats && <p className="text-slate-500">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}