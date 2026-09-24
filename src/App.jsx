import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import StatusPopup from './components/StatusPopup';
import { useJobs } from './hooks/useJobs';
import { useAuth } from './hooks/useAuth';
import { isOfferStatus } from './constants/statuses';
import './App.css';

function App() {
  const { jobs, addJob, updateJob, deleteJob, clearJobs } = useJobs();
  const { isLoggedIn, login, logout } = useAuth();
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

  return (
    <div>
      {popupJob && (
        <StatusPopup
          job={popupJob}
          onClose={() => setPopupJob(null)}
          onDeleteAll={handleDeleteAll}
        />
      )}
      <Router>
        <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard
                  jobs={jobs}
                  onAdd={handleAdd}
                  onDelete={deleteJob}
                  onUpdate={handleUpdate}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Analytics jobs={jobs} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Chatbot />
      </Router>
    </div>
  );
}

export default App;
