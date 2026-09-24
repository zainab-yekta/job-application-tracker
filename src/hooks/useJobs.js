import { useState, useEffect } from 'react';
import { migrateJob } from '../utils/migrateJob';

const STORAGE_KEY = 'jobs';

function loadJobs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.map(migrateJob) : [];
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
