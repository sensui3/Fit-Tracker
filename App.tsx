import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="create-plan" element={<CreatePlan />} />
            <Route path="log-workout" element={<LogWorkout />} />
            <Route path="exercise/:id" element={<ExerciseDetails />} />
            <Route path="workouts" element={<ExerciseLibrary />} />
            <Route path="goals" element={<Goals />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="timer" element={<Timer />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;