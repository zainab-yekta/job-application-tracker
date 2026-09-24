import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('jobs');
    return saved
      ? JSON.parse(saved).map(job => job.status === 'Accepted' ? { ...job, status: 'Offer' } : job)
      : [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const [showAcceptButtons, setShowAcceptButtons] = useState(false);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  const showStatusMessage = (job) => {
    if (job.status === 'Offer') {
      setCongratsMessage('Waoo, you got an offer, think about this offer and then accept it. Congratulations.');
      setShowAcceptButtons(false);
      setShowCongrats(true);
    } else if (job.status === 'Accepted Offer') {
      setCongratsMessage(`Congratulations again, finally you accepted the offer at ${job.company}, and you are selected. So you will start your job soon. Best of luck for your new journey. For now, let me know if you want to continue with us in job searching and want us to keep the data tracking or do you want to clear your applied job tracking?`);
      setShowAcceptButtons(true);
      setShowCongrats(true);
    } else {
      setShowCongrats(false);
    }
  };

  const addJob = (job) => {
    setJobs((prev) => [...prev, job]);
    showStatusMessage(job);
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const updateJob = (updatedJob) => {
    const previous = jobs.find((job) => job.id === updatedJob.id);
    setJobs((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
    // Only celebrate when the status actually changes
    if (previous?.status !== updatedJob.status) {
      showStatusMessage(updatedJob);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('This will delete all your tracked applications. Are you sure?')) {
      setJobs([]);
    }
    setShowCongrats(false);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div>
      {showCongrats && (
        <div className="congrats-popup2">
          <p>{congratsMessage}</p>
          {showAcceptButtons ? (
            <div>
              <button onClick={() => setShowCongrats(false)}>Keep It</button>
              <button onClick={handleDeleteAll}>Delete All</button>
            </div>
          ) : (
            <button onClick={() => setShowCongrats(false)}>Dismiss</button>
          )}
        </div>
      )}
      <Router>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard
                  jobs={jobs}
                  onAdd={addJob}
                  onDelete={deleteJob}
                  onUpdate={updateJob}
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
