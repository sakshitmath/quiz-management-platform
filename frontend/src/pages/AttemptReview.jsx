import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function AttemptReview() {
  const { attemptId } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/attempts/${attemptId}`)
      .then((res) => setDetail(res.data))
      .catch(() => setError('Could not load review.'));
  }, [attemptId]);

  if (error) {
    return <div className="min-h-screen bg-slate-50 p-8 text-red-600">{error}</div>;
  }

  if (!detail) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/student/dashboard" className="text-sm text-slate-500 hover:text-slate-800 underline">
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-1">{detail.quizTitle} — Review</h1>
        <p className="text-slate-500 mb-6">{detail.percentage}% · {detail.status}</p>

        <div className="space-y-4">
          {detail.answers.map((ans, i) => (
            <div
              key={ans.questionId}
              className={`bg-white rounded-lg border p-5 ${ans.correct ? 'border-green-200' : 'border-red-200'}`}
            >
              <p className="font-medium text-slate-800 mb-2">
                {i + 1}. {ans.questionText}
              </p>

              <p className="text-sm mb-1">
                <span className="text-slate-400">Your answer: </span>
                <span className={ans.correct ? 'text-green-700' : 'text-red-700'}>
                  {ans.selectedOptionText || 'Not answered'}
                </span>
              </p>

              {!ans.correct && (
                <p className="text-sm mb-1">
                  <span className="text-slate-400">Correct answer: </span>
                  <span className="text-green-700">{ans.correctOptionText}</span>
                </p>
              )}

              {ans.explanation && (
                <p className="text-sm text-slate-500 mt-2 italic">{ans.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}