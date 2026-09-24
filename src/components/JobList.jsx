import React from 'react';
import { Building2, CalendarDays, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { formatDisplayDate } from '../utils/formatDate';
import { statusClassName } from '../constants/statuses';
import './JobList.css';

function JobCard({ job, isEditing, onEdit, onDelete }) {
  const title = job.title || 'Untitled application';

  return (
    <li className={`job-card card${isEditing ? ' is-editing' : ''}`}>
      <div className="job-card-header">
        <h3 className="job-card-title">{title}</h3>
        <span className={`badge badge-${statusClassName(job.status)}`}>
          {job.status || 'No status'}
        </span>
      </div>

      <dl className="job-card-details">
        <div>
          <dt>
            <Building2 size={16} aria-hidden="true" />
            <span className="sr-only">Company</span>
          </dt>
          <dd>{job.company || 'N/A'}</dd>
        </div>
        <div>
          <dt>
            <MapPin size={16} aria-hidden="true" />
            <span className="sr-only">Location</span>
          </dt>
          <dd>{job.location || 'N/A'}</dd>
        </div>
        <div>
          <dt>
            <CalendarDays size={16} aria-hidden="true" />
            <span className="sr-only">Applied</span>
          </dt>
          <dd>Applied: {formatDisplayDate(job.appliedDate)}</dd>
        </div>
        {job.interviewDate && (
          <div>
            <dt>
              <Clock size={16} aria-hidden="true" />
              <span className="sr-only">Interview</span>
            </dt>
            <dd>
              Interview: {formatDisplayDate(job.interviewDate)}
              {job.interviewTime ? `, ${job.interviewTime}` : ''}
            </dd>
          </div>
        )}
      </dl>

      <div className="job-card-actions">
        <button type="button" className="btn btn-secondary" onClick={() => onEdit(job)}>
          <Pencil size={16} aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-icon job-card-delete"
          onClick={() => onDelete(job.id)}
          aria-label={`Delete ${title}`}
          title="Delete"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function JobList({ jobs, editingId, onDelete, onEdit, empty }) {
  if (jobs.length === 0) return empty;

  return (
    <ul className="job-list">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isEditing={job.id === editingId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default JobList;
