import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function AdminUsers() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = () => {
    api.get('/users').then((res) => setStudents(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const toggleStatus = async (id) => {
    await api.patch(`/users/${id}/status`);
    loadStudents();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Students</h1>

      {loading && <p className="text-slate-500">Loading...</p>}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Quizzes Attempted</th>
              <th className="px-5 py-3 font-medium">Avg Score</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 text-slate-800 font-medium">{s.name}</td>
                <td className="px-5 py-3 text-slate-600">{s.email}</td>
                <td className="px-5 py-3 text-slate-600">{s.quizzesAttempted}</td>
                <td className="px-5 py-3 text-slate-600">{s.averageScore}%</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    s.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleStatus(s.id)}
                    className="text-sm text-slate-600 hover:underline"
                  >
                    {s.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && students.length === 0 && (
          <p className="text-slate-500 px-5 py-4">No students registered yet.</p>
        )}
      </div>
    </AdminLayout>
  );
}