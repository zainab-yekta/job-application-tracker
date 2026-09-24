import { parseLocalDate } from './formatDate';

// Interviews that are still to come today or tomorrow
export function getUpcomingInterviews(jobs, now = new Date()) {
  const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

  return jobs.filter((job) => {
    if (job.status !== 'Interview') return false;
    const interview = parseLocalDate(job.date, job.interviewTime);
    return interview && interview >= now && interview < endOfTomorrow;
  });
}
