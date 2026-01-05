import React, { Suspense, lazy } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { AppInitializer } from './components/AppInitializer';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { initSentry } from './lib/sentry';

// Initialize Sentry
initSentry();

// Lazy loading pages for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const CreatePlan = lazy(() => import('./pages/CreatePlan'));
const LogWorkout = lazy(() => import('./pages/LogWorkout'));
const ExerciseDetails = lazy(() => import('./pages/ExerciseDetails'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutHistory = lazy(() => import('./pages/WorkoutHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Timer = lazy(() => import('./pages/Timer'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Goals = lazy(() => import('./pages/Goals'));
const Subscription = lazy(() => import('./pages/Subscription'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#102210]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppInitializer />
            <HashRouter>
              <Suspense fallback={<PageLoader />}>
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
                    <Route path="workouts" element={<WorkoutHistory />} />
                    <Route path="exercises" element={<ExerciseLibrary />} />
                    <Route path="goals" element={<Goals />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="timer" element={<Timer />} />
                    <Route path="notifications" element={<Notifications />} />
                  </Route>
                </Routes>
              </Suspense>
            </HashRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
};

export default App;