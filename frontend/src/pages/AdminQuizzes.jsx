import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', difficulty: 'EASY',
    duration: 20, passingScore: 60, maxAttempts: 2,
  });

  const loadQuizzes = () => {
    api.get('/quizzes/admin/all').then((res) => setQuizzes(res.data));
  };

  useEffect(() => {
    loadQuizzes();
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/quizzes', {
        ...form,
        categoryId: Number(form.categoryId),
        duration: Number(form.duration),
        passingScore: Number(form.passingScore),
        maxAttempts: Number(form.maxAttempts),
      });
      setForm({ title: '', description: '', categoryId: '', difficulty: 'EASY', duration: 20, passingScore: 60, maxAttempts: 2 });
      setShowForm(false);
      loadQuizzes();
    } catch (err) {
      setError(err.response?.data || 'Could not create quiz.');
    }
  };

  const togglePublish = async (id) => {
    await api.patch(`/quizzes/${id}/publish`);
    loadQuizzes();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz? This cannot be undone.')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      loadQuizzes();
    } catch (err) {
      alert(err.response?.data || 'Could not delete quiz.');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quizzes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded font-medium"
        >
          {showForm ? 'Cancel' : '+ New Quiz'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg border border-slate-200 p-5 mb-6 space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required
            className="w-full border border-slate-300 rounded px-3 py-2" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description"
            className="w-full border border-slate-300 rounded px-3 py-2" />

          <div className="grid grid-cols-2 gap-3">
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required
              className="border border-slate-300 rounded px-3 py-2">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select name="difficulty" value={form.difficulty} onChange={handleChange}
              className="border border-slate-300 rounded px-3 py-2">
              <option value="EASY">Easy</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="HARD">Hard</option>
            </select>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Duration (min)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Passing Score (%)</label>
              <input type="number" name="passingScore" value={form.passingScore} onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Max Attempts</label>
              <input type="number" name="maxAttempts" value={form.maxAttempts} onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2" />
            </div>
          </div>

          <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded font-medium">
            Create Quiz
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-slate-200 divide-y">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="flex justify-between items-center px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-800">{quiz.title}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  quiz.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {quiz.status}
                </span>
              </div>
              <p className="text-sm text-slate-500">{quiz.category?.name} · {quiz.duration} min · {quiz.difficulty}</p>
            </div>

            <div className="flex gap-3 items-center">
              <Link to={`/admin/quizzes/${quiz.id}/questions`} className="text-sm text-slate-600 hover:underline">
                Questions
              </Link>
              <button onClick={() => togglePublish(quiz.id)} className="text-sm text-slate-600 hover:underline">
                {quiz.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => handleDelete(quiz.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <p className="text-slate-500 px-5 py-4">No quizzes yet.</p>}
      </div>
    </AdminLayout>
  );
}