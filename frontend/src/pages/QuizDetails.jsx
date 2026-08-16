import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then((res) => setQuiz(res.data))
      .catch(() => setError('Could not load quiz details.'));

    api.get(`/quizzes/${id}/questions`)
      .then((res) => setQuestionCount(res.data.length))
      .catch(() => setQuestionCount(null));
  }, [id]);

  const handleStart = async () => {
    setStarting(true);
    setError('');
    try {
      const response = await api.post(`/quizzes/${id}/start`);
      navigate(`/student/attempt/${response.data.attemptId}`, { state: response.data });
    } catch (err) {
      setError(err.response?.data || 'Could not start quiz.');
      setStarting(false);
    }
  };

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-600">{error}</p>
        <Link to="/student/dashboard" className="text-slate-800 underline">Back to dashboard</Link>
      </div>
    );
  }

  if (!quiz) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Link to="/student/dashboard" className="text-sm text-slate-500 hover:text-slate-800 underline">
        ← Back to dashboard
      </Link>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-8 mt-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h1>
        <p className="text-slate-500 mb-6">{quiz.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-slate-400">Questions:</span> <span className="text-slate-700">{questionCount ?? '...'}</span></div>
          <div><span className="text-slate-400">Category:</span> <span className="text-slate-700">{quiz.category?.name}</span></div>
          <div><span className="text-slate-400">Difficulty:</span> <span className="text-slate-700">{quiz.difficulty}</span></div>
          <div><span className="text-slate-400">Duration:</span> <span className="text-slate-700">{quiz.duration} minutes</span></div>
          <div><span className="text-slate-400">Passing Score:</span> <span className="text-slate-700">{quiz.passingScore}%</span></div>
          <div><span className="text-slate-400">Max Attempts:</span> <span className="text-slate-700">{quiz.maxAttempts}</span></div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-700 disabled:opacity-50"
        >
          {starting ? 'Starting...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}