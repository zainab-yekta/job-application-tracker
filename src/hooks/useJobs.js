import { useState, useEffect } from 'react';

const STORAGE_KEY = 'jobs';

function loadJobs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    // Older versions saved an accepted job as 'Accepted'
    return saved.map((job) => (job.status === 'Accepted' ? { ...job, status: 'Offer' } : job));
  } catch {
    return [];
  }
}

export function useJobs() {
  const [jobs, setJobs] = useState(loadJobs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job) => setJobs((prev) => [...prev, job]);

  const updateJob = (updatedJob) =>
    setJobs((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));

  const deleteJob = (id) => setJobs((prev) => prev.filter((job) => job.id !== id));

  const clearJobs = () => setJobs([]);

  return { jobs, addJob, updateJob, deleteJob, clearJobs };
}
