import React, { useState } from 'react';

const EMPTY_FORM = {
  title: '',
  company: '',
  location: '',
  date: '',
  status: 'Applied',
  interviewTime: '',
};

const toFormValues = (job) =>
  job
    ? {
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        date: job.date || '',
        status: job.status || 'Applied',
        interviewTime: job.interviewTime || '',
      }
    : EMPTY_FORM;

// The parent gives this form a `key` based on the job being edited,
// so React creates a fresh form whenever editing starts or ends.
function JobForm({ jobToEdit, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(jobToEdit));

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, company, location, date, status, interviewTime } = form;

    if (!title.trim() || !company.trim() || !date) {
      alert('Please fill in title, company and date');
      return;
    }
    if (status === 'Interview' && !interviewTime) {
      alert('Please set interview time for status Interview');
      return;
    }

    onSubmit({
      id: jobToEdit ? jobToEdit.id : Date.now(),
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      date,
      status,
      interviewTime: status === 'Interview' ? interviewTime : '',
    });
    setForm(EMPTY_FORM);
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <input
        type="text"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange('title')}
      />
      <input
        type="text"
        placeholder="Company"
        value={form.company}
        onChange={handleChange('company')}
      />
      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={handleChange('location')}
      />
      <input type="date" value={form.date} onChange={handleChange('date')} />
      <select value={form.status} onChange={handleChange('status')}>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
        <option value="Accepted Offer">Accepted Offer</option>
      </select>
      {/* Time input only if status is Interview */}
      {form.status === 'Interview' && (
        <input
          type="time"
          value={form.interviewTime}
          onChange={handleChange('interviewTime')}
          required
        />
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
