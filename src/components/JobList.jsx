import React from 'react';
import { formatDisplayDate } from '../utils/formatDate';
import { statusClassName } from '../constants/statuses';

function JobList({ jobs, onDelete, onEdit, emptyMessage = 'No job applications added yet.' }) {
  if (jobs.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div className="job-item" key={job.id}>
          <div className="job-details">
            <div className="job-title">{job.title}</div>
            <div className="job-meta">Company: {job.company}</div>
            <div className="job-meta">Location: {job.location || 'N/A'}</div>
            <div className="job-meta">Applied: {formatDisplayDate(job.appliedDate)}</div>
            {job.interviewDate && (
              <div className="job-meta">
                Interview: {formatDisplayDate(job.interviewDate)}
                {job.interviewTime ? `, ${job.interviewTime}` : ''}
              </div>
            )}
            <div className={`job-meta status ${statusClassName(job.status)}`}>
              Status: {job.status || 'N/A'}
            </div>
          </div>
          <div className="job-actions">
            <button onClick={() => onEdit(job)}>Edit</button>
            <button className="delete" onClick={() => onDelete(job.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
