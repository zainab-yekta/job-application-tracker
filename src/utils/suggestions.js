// Tips shown on the Analytics page, based on how the search is going
export function getSuggestions({
  totalApplied,
  appliedCount,
  interviewCount,
  rejectedCount,
  offerCount,
}) {
  const suggestions = [];

  if (totalApplied >= 5 && interviewCount === 0 && offerCount === 0 && rejectedCount === 0) {
    suggestions.push(
      "You've applied to many jobs but haven't received responses. Consider reviewing your resume or matching job requirements better.",
    );
  } else if (interviewCount === 0 && totalApplied > 3) {
    suggestions.push(
      "You haven't received any interviews. Try tailoring your cover letter or applying to different job roles.",
    );
  }

  if (appliedCount >= 4) {
    suggestions.push(
      "Several jobs are still marked as 'Applied'. Consider following up to show continued interest.",
    );
  }

  if (interviewCount >= 3 && offerCount === 0) {
    suggestions.push(
      "You're getting interviews but no offers yet. You may want to improve your interview skills or assess company fit.",
    );
  }

  if (totalApplied > 0 && rejectedCount / totalApplied > 0.5) {
    suggestions.push(
      'You have a high rejection rate. Consider improving your CV or revising your job search focus.',
    );
  }

  if (offerCount > 0 && interviewCount > 0) {
    suggestions.push(
      "You're doing great! Keep up the good work and continue following up on your applications.",
    );
  }

  return suggestions;
}
