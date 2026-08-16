import { Link } from 'react-router-dom';

export default function QuizCard({ quiz }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-800 text-lg">{quiz.title}</h3>
        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
          {quiz.difficulty}
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{quiz.description}</p>
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <span>{quiz.duration} min</span>
        <span>Pass: {quiz.passingScore}%</span>
        <span>Attempts: {quiz.maxAttempts}</span>
      </div>
      <Link
        to={`/student/quiz/${quiz.id}`}
        className="block text-center bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-700"
      >
        View Details
      </Link>
    </div>
  );
}