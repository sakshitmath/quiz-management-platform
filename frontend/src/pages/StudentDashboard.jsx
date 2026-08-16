import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import QuizCard from '../components/QuizCard';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    api.get('/quizzes')
      .then((res) => setQuizzes(res.data))
      .catch(() => setError('Could not load quizzes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Map(quizzes.map((q) => [q.category?.id, q.category])).values()].filter(Boolean);

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || q.category?.id === Number(categoryFilter);
    const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
        <div className="flex items-center gap-4">
          <Link to="/leaderboard" className="text-sm text-slate-500 hover:text-slate-800 underline">
            Leaderboard
          </Link>
          <Link to="/student/attempt-history" className="text-sm text-slate-500 hover:text-slate-800 underline">
            Attempt History
          </Link>
          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            Log out
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-4">Available Quizzes</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All difficulties</option>
          <option value="EASY">Easy</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      {loading && <p className="text-slate-500">Loading quizzes...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && filteredQuizzes.length === 0 && (
        <p className="text-slate-500">No quizzes match your search.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}