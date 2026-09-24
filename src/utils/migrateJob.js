// Brings jobs saved by older versions of the app up to the current shape:
// { id, title, company, location, status, appliedDate, interviewDate, interviewTime }
export function migrateJob(job) {
  const migrated = { ...job };

  // Older versions saved an accepted job as 'Accepted'
  if (migrated.status === 'Accepted') migrated.status = 'Offer';

  // Older versions had a single `date` field. It held the interview date for
  // jobs in the Interview stage and the application date for everything else.
  if ('date' in migrated) {
    if (!migrated.appliedDate) migrated.appliedDate = migrated.date || '';
    if (!migrated.interviewDate && migrated.status === 'Interview') {
      migrated.interviewDate = migrated.date || '';
    }
    delete migrated.date;
  }

  return {
    ...migrated,
    title: migrated.title || '',
    company: migrated.company || '',
    location: migrated.location || '',
    status: migrated.status || 'Applied',
    appliedDate: migrated.appliedDate || '',
    interviewDate: migrated.interviewDate || '',
    interviewTime: migrated.interviewTime || '',
  };
}
