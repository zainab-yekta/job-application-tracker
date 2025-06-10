import React from 'react';
import { formatDisplayDate } from '../utils/FormatDate';

function JobList({ jobs, onDelete, onEdit }) {
  if (jobs.length === 0) {
    return <p style={{ textAlign: 'center' }}>No job applications added yet.</p>;
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div className="job-item" key={job.id}>
          <div className="job-details">
            <div className="job-title">{job.title}</div>
            <div className="job-meta">Company: {job.company}</div>
            <div className="job-meta">Location: {job.location || 'N/A'}</div>
            <div className="job-meta">
              Date: {job.date ? formatDisplayDate(job.date) : 'N/A'}
              {job.status === 'Interview' && job.interviewTime ? `, ${job.interviewTime}` : ''}
            </div>
            <div className={`job-meta status ${job.status?.toLowerCase() || 'na'}`}>
              Status: {job.status || 'N/A'}
            </div>
          </div>
          <div className="job-actions">
            <button onClick={() => onEdit(job)}>Edit</button>
            <button className="delete" onClick={() => onDelete(job.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
