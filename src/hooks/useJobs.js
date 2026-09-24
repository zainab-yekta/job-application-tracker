import { useState } from 'react';
import { loadJobs, saveJobs } from '../services/storage';

// The job list of one account. The component using this hook is keyed by the
// account's email, so switching accounts starts with a fresh list.
export function useJobs(email) {
  const [jobs, setJobs] = useState(() => loadJobs(email));
  const [saveFailed, setSaveFailed] = useState(false);

  // Every change goes through here so the saved copy always matches the screen
  const commit = (next) => {
    setJobs(next);
    setSaveFailed(!saveJobs(email, next));
  };

  const addJob = (job) => commit([...jobs, job]);

  const updateJob = (updatedJob) =>
    commit(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));

  const deleteJob = (id) => commit(jobs.filter((job) => job.id !== id));

  const clearJobs = () => commit([]);

  // Imported jobs replace saved jobs that have the same id
  const importJobs = (imported) => {
    const importedIds = new Set(imported.map((job) => job.id));
    commit([...jobs.filter((job) => !importedIds.has(job.id)), ...imported]);
  };

  return { jobs, saveFailed, addJob, updateJob, deleteJob, clearJobs, importJobs };
}
