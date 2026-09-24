import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import StatusPopup from './components/StatusPopup';
import ErrorBoundary from './components/ErrorBoundary';
import { useJobs } from './hooks/useJobs';
import { useAuth } from './hooks/useAuth';
import { isOfferStatus } from './constants/statuses';

// The chart library is large, so the Analytics page loads on first visit
const Analytics = lazy(() => import('./pages/Analytics'));

// Everything that depends on the logged in account. App gives it a `key` of the
// account's email, so logging in as someone else loads that person's jobs.
function Workspace({ auth }) {
  const { jobs, saveFailed, addJob, updateJob, deleteJob, clearJobs, importJobs } = useJobs(
    auth.user,
  );
  // The job whose new status triggered the congratulations popup
  const [popupJob, setPopupJob] = useState(null);

  const showPopupFor = (job) => setPopupJob(isOfferStatus(job.status) ? job : null);

  const handleAdd = (job) => {
    addJob(job);
    showPopupFor(job);
  };

  const handleUpdate = (updatedJob) => {
    const previous = jobs.find((job) => job.id === updatedJob.id);
    updateJob(updatedJob);
    // Only celebrate when the status actually changes
    if (previous?.status !== updatedJob.status) {
      showPopupFor(updatedJob);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('This will delete all your tracked applications. Are you sure?')) {
      clearJobs();
    }
    setPopupJob(null);
  };

  const loggedInRedirect = <Navigate to="/dashboard" replace />;

  return (
    <>
      {popupJob && (
        <StatusPopup
          job={popupJob}
          onClose={() => setPopupJob(null)}
          onDeleteAll={handleDeleteAll}
        />
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home isLoggedIn={auth.isLoggedIn} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={auth.isLoggedIn ? loggedInRedirect : <Login onLogin={auth.login} />}
        />
        <Route
          path="/register"
          element={auth.isLoggedIn ? loggedInRedirect : <Register onRegister={auth.register} />}
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={auth.isLoggedIn}>
              <Dashboard
                jobs={jobs}
                saveFailed={saveFailed}
                onAdd={handleAdd}
                onDelete={deleteJob}
                onUpdate={handleUpdate}
                onImport={importJobs}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute isLoggedIn={auth.isLoggedIn}>
              <Suspense fallback={<p className="page-loading">Loading analytics…</p>}>
                <Analytics jobs={jobs} />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function PageErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>;
}

function App() {
  const auth = useAuth();

  return (
    <Router>
      <div className="app-shell">
        <Navbar isLoggedIn={auth.isLoggedIn} onLogout={auth.logout} />
        <div className="app-main">
          <PageErrorBoundary>
            <Workspace key={auth.user ?? 'guest'} auth={auth} />
          </PageErrorBoundary>
        </div>
        <Footer />
      </div>
      <Chatbot />
    </Router>
  );
}

export default App;
