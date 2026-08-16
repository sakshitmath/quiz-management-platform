import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import QuizDetails from './pages/QuizDetails';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/:id"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <QuizDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/attempt/:attemptId"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <QuizAttempt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/result/:attemptId"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <QuizResult />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;