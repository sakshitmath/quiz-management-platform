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

  useEffect(() => {
    api.get('/quizzes')
      .then((res) => setQuizzes(res.data))
      .catch(() => setError('Could not load quizzes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
        <div className="flex items-center gap-4">
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

      {loading && <p className="text-slate-500">Loading quizzes...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && quizzes.length === 0 && (
        <p className="text-slate-500">No quizzes available right now. Check back later.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}