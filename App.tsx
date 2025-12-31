import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import CreatePlan from './pages/CreatePlan';
import LogWorkout from './pages/LogWorkout';
import ExerciseDetails from './pages/ExerciseDetails';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Timer from './pages/Timer';
import Notifications from './pages/Notifications';
import Goals from './pages/Goals';
import Subscription from './pages/Subscription';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="create-plan" element={<CreatePlan />} />
              <Route path="log-workout" element={<LogWorkout />} />
              <Route path="exercise/:id" element={<ExerciseDetails />} />
              <Route path="workouts" element={<ExerciseLibrary />} />
              <Route path="goals" element={<Goals />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="timer" element={<Timer />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;