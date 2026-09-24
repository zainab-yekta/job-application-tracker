// Returns a message per invalid field; an empty object means the job can be saved
export function validateJob(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Enter the job title.';
  if (!form.company.trim()) errors.company = 'Enter the company name.';
  if (!form.appliedDate) errors.appliedDate = 'Pick the date you applied.';
  if (form.status === 'Interview') {
    if (!form.interviewDate) errors.interviewDate = 'Pick the interview date.';
    if (!form.interviewTime) errors.interviewTime = 'Pick the interview time.';
  }
  return errors;
}
