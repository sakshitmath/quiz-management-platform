import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const loadCategories = () => {
    api.get('/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name, description });
      setName('');
      setDescription('');
      loadCategories();
    } catch (err) {
      setError(err.response?.data || 'Could not create category.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert(err.response?.data || 'Could not delete category.');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Categories</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-lg border border-slate-200 p-5 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded font-medium">
          Add
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-lg border border-slate-200 divide-y">
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center px-5 py-3">
            <div>
              <p className="font-medium text-slate-800">{cat.name}</p>
              <p className="text-sm text-slate-500">{cat.description}</p>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-slate-500 px-5 py-4">No categories yet.</p>
        )}
      </div>
    </AdminLayout>
  );
}