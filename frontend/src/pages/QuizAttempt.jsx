import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function QuizAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [attemptData] = useState(location.state || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculate initial time left from server-provided expiresAt
  useEffect(() => {
    if (!attemptData) return;
    const expires = new Date(attemptData.expiresAt).getTime();
    const now = new Date().getTime();
    setTimeLeft(Math.max(0, Math.floor((expires - now) / 1000)));
  }, [attemptData]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');

    const answerList = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId: Number(questionId),
      selectedOptionId: Number(selectedOptionId),
    }));

    try {
      const response = await api.post(`/attempts/${attemptId}/submit`, { answers: answerList });
      navigate(`/student/result/${attemptId}`, { state: response.data });
    } catch (err) {
      setError(err.response?.data || 'Could not submit quiz.');
      setSubmitting(false);
    }
  }, [answers, attemptId, navigate, submitting]);

  // Countdown timer — auto-submits at zero
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  if (!attemptData) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-600">Attempt data not found. Please start the quiz again.</p>
      </div>
    );
  }

  const questions = attemptData.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;

  const selectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-slate-800">{attemptData.quizTitle}</h1>
          <div className={`font-mono text-lg font-semibold px-3 py-1 rounded ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Question {currentIndex + 1} of {totalQuestions} · {answeredCount} answered
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-4">
          <h2 className="text-lg font-medium text-slate-800 mb-4">{currentQuestion.questionText}</h2>

          <div className="space-y-2">
            {currentQuestion.options.map((opt) => (
              <label
                key={opt.id}
                className={`block border rounded px-4 py-2 cursor-pointer transition-colors ${
                  answers[currentQuestion.id] === opt.id
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === opt.id}
                  onChange={() => selectOption(currentQuestion.id, opt.id)}
                  className="mr-2"
                />
                {opt.optionText}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  i === currentIndex
                    ? 'bg-slate-800 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
              className="px-4 py-2 rounded bg-slate-800 text-white"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}