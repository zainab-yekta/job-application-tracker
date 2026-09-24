// Applies the dashboard search box, status filter and date filter
export function filterJobs(jobs, { status = 'All', search = '', date = '' } = {}) {
  const term = search.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesStatus = status === 'All' || job.status === status;
    const matchesSearch =
      (job.title || '').toLowerCase().includes(term) ||
      (job.company || '').toLowerCase().includes(term);
    const matchesDate = !date || job.appliedDate === date || job.interviewDate === date;
    return matchesStatus && matchesSearch && matchesDate;
  });
}
