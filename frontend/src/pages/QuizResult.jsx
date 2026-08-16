import { useLocation, useParams, Link } from 'react-router-dom';

export default function QuizResult() {
  const location = useLocation();
  const { attemptId } = useParams();
  const result = location.state;

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-slate-500 mb-4">Result data not available.</p>
        <Link to={`/student/attempt-history`} className="text-slate-800 underline">
          View attempt history instead
        </Link>
      </div>
    );
  }

  const passed = result.status === 'PASSED';

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {result.status}
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">{result.quizTitle}</h1>
        <p className="text-4xl font-bold text-slate-800 my-4">{result.percentage}%</p>

        <div className="grid grid-cols-3 gap-3 text-sm mb-6">
          <div className="bg-green-50 rounded p-3">
            <div className="font-bold text-green-700 text-lg">{result.correctAnswers}</div>
            <div className="text-green-600">Correct</div>
          </div>
          <div className="bg-red-50 rounded p-3">
            <div className="font-bold text-red-700 text-lg">{result.incorrectAnswers}</div>
            <div className="text-red-600">Incorrect</div>
          </div>
          <div className="bg-slate-100 rounded p-3">
            <div className="font-bold text-slate-700 text-lg">{result.unanswered}</div>
            <div className="text-slate-600">Unanswered</div>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          {result.obtainedMarks} / {result.totalMarks} marks · Time taken: {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s
        </p>

        <div className="flex gap-3">
          <Link
            to={`/student/attempt/${attemptId}/review`}
            className="flex-1 bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-700"
          >
            Review Answers
          </Link>
          <Link
            to="/student/dashboard"
            className="flex-1 border border-slate-300 text-slate-700 py-2 rounded font-medium hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}