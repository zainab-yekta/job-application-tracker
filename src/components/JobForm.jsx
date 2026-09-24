import React, { useState } from 'react';
import { STATUSES } from '../constants/statuses';
import { validateJob } from '../utils/validateJob';

const EMPTY_FORM = {
  title: '',
  company: '',
  location: '',
  appliedDate: '',
  status: 'Applied',
  interviewDate: '',
  interviewTime: '',
};

const toFormValues = (job) =>
  job
    ? {
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        appliedDate: job.appliedDate || '',
        status: job.status || 'Applied',
        interviewDate: job.interviewDate || '',
        interviewTime: job.interviewTime || '',
      }
    : EMPTY_FORM;

// The parent gives this form a `key` based on the job being edited,
// so React creates a fresh form whenever editing starts or ends.
function JobForm({ jobToEdit, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(jobToEdit));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateJob(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const isInterview = form.status === 'Interview';
    onSubmit({
      id: jobToEdit ? jobToEdit.id : Date.now(),
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      status: form.status,
      appliedDate: form.appliedDate,
      // Keep a past interview on record when the job moves to a later stage
      interviewDate: isInterview ? form.interviewDate : jobToEdit?.interviewDate || '',
      interviewTime: isInterview ? form.interviewTime : jobToEdit?.interviewTime || '',
    });
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const errorMessages = Object.values(errors).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="job-form" noValidate>
      <label className="sr-only" htmlFor="job-title">
        Job title
      </label>
      <input
        id="job-title"
        type="text"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange('title')}
        aria-invalid={Boolean(errors.title)}
      />
      <label className="sr-only" htmlFor="job-company">
        Company
      </label>
      <input
        id="job-company"
        type="text"
        placeholder="Company"
        value={form.company}
        onChange={handleChange('company')}
        aria-invalid={Boolean(errors.company)}
      />
      <label className="sr-only" htmlFor="job-location">
        Location
      </label>
      <input
        id="job-location"
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={handleChange('location')}
      />
      <div className="field">
        <label htmlFor="job-applied">Applied on</label>
        <input
          id="job-applied"
          type="date"
          value={form.appliedDate}
          onChange={handleChange('appliedDate')}
          aria-invalid={Boolean(errors.appliedDate)}
        />
      </div>
      <div className="field">
        <label htmlFor="job-status">Status</label>
        <select id="job-status" value={form.status} onChange={handleChange('status')}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      {form.status === 'Interview' && (
        <>
          <div className="field">
            <label htmlFor="job-interview-date">Interview date</label>
            <input
              id="job-interview-date"
              type="date"
              value={form.interviewDate}
              onChange={handleChange('interviewDate')}
              aria-invalid={Boolean(errors.interviewDate)}
            />
          </div>
          <div className="field">
            <label htmlFor="job-interview-time">Interview time</label>
            <input
              id="job-interview-time"
              type="time"
              value={form.interviewTime}
              onChange={handleChange('interviewTime')}
              aria-invalid={Boolean(errors.interviewTime)}
            />
          </div>
        </>
      )}
      {errorMessages.length > 0 && (
        <ul className="form-errors" role="alert">
          {errorMessages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      <button type="submit">{jobToEdit ? 'Save' : 'Add Job'}</button>
      {jobToEdit && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default JobForm;
