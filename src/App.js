import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
//import CongratulationsNotification from './components/CongratulationsNotification';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('jobs');
    return saved
  ? JSON.parse(saved).map(job => job.status === 'Accepted' ? { ...job, status: 'Offer' } : job) : [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  //const [congratsJobId, setCongratsJobId] = useState(null); // track which job triggered it
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const [showAcceptButtons, setShowAcceptButtons] = useState(false);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const updateJob = (updatedJob, afterUpdateCallback) => {
  setJobs((prev) => {
    const updatedJobs = prev.map((job) =>
      job.id === updatedJob.id ? updatedJob : job
    );

    if (updatedJob.status === "Offer") {
      setCongratsMessage("Waoo, you got an offer, think about this offer and then accept it. Congratulations.");
      //setShowCongrats(true); //React strictly forbids calling setState() while another component is rendering — it causes unpredictable UI behavior. Move any setState() calls (like setShowCongrats(...)) into a useEffect(), so it only runs after the render finishes.
      setShowAcceptButtons(false);
    } else if (updatedJob.status === "Accepted Offer") {
      setCongratsMessage(`Congratulations again, finally you accepted the offer at ${updatedJob.company}, and you are selected. So you will start your job soon. Best of luck for your new journey. For now, let me know if you want to continue with us in job searching and want us to keep the data tracking or do you want to clear your applied job tracking?`);
      setShowCongrats(true);
      setShowAcceptButtons(true);
    } else {
      setShowCongrats(false);
    }

    if (typeof afterUpdateCallback === "function") {
      afterUpdateCallback();
    }

    return updatedJobs;
  });
};

//const handleKeepTracking = () => {
 // setShowCongrats(false);
//  setCongratsJobId(null);
//};

//const handleCloseJob = () => {
 // const updatedJobs = jobs.filter((job) => job.id !== congratsJobId);
 // setJobs(updatedJobs);
 // setShowCongrats(false);
//  setCongratsJobId(null);
//};

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
          <button onClick={() => setShowCongrats(false)}>Delete All</button>
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

        {/* Catch-all for non-logged-in users */}
        {/*{!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}*/}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Place Chatbot outside Routes */}
      <Chatbot />
    </Router>
  </div>
);
}

export default App;
