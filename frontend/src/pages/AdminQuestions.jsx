import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function AdminQuestions() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(5);
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const loadData = () => {
    api.get(`/quizzes/${quizId}`).then((res) => setQuiz(res.data));
    api.get(`/quizzes/${quizId}/questions`).then((res) => setQuestions(res.data));
  };

  useEffect(() => {
    loadData();
  }, [quizId]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      questionText,
      marks: Number(marks),
      explanation,
      difficulty,
      options: options.map((text, i) => ({
        optionText: text,
        isCorrect: i === correctIndex,
      })),
    };

    try {
      await api.post(`/quizzes/${quizId}/questions`, payload);
      setQuestionText('');
      setMarks(5);
      setExplanation('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      loadData();
    } catch (err) {
      setError(err.response?.data || 'Could not add question.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    await api.delete(`/questions/${id}`);
    loadData();
  };

  return (
    <AdminLayout>
      <Link to="/admin/quizzes" className="text-sm text-slate-500 hover:text-slate-800 underline">
        ← Back to quizzes
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">
        {quiz?.title} — Questions ({questions.length})
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-5 mb-6 space-y-3">
        <h2 className="font-medium text-slate-700">Add Question</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Question text"
          required
          className="w-full border border-slate-300 rounded px-3 py-2"
        />

        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctOption"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
              />
              <input
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                required
                className="flex-1 border border-slate-300 rounded px-3 py-2"
              />
            </div>
          ))}
          <p className="text-xs text-slate-400">Select the radio button next to the correct option.</p>
        </div>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explanation (shown after quiz submission)"
          className="w-full border border-slate-300 rounded px-3 py-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Marks</label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
            >
              <option value="EASY">Easy</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded font-medium">
          Add Question
        </button>
      </form>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-800">{i + 1}. {q.questionText}</p>
              <button onClick={() => handleDelete(q.id)} className="text-sm text-red-600 hover:underline shrink-0 ml-3">
                Delete
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">{q.marks} marks · {q.difficulty}</p>
          </div>
        ))}
        {questions.length === 0 && <p className="text-slate-500">No questions added yet.</p>}
      </div>
    </AdminLayout>
  );
}