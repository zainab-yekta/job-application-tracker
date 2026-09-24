import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Plus, Save } from 'lucide-react';
import { STATUSES } from '../constants/statuses';
import { validateJob } from '../utils/validateJob';
import './JobForm.css';

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

// One labelled field with its error message directly underneath
function Field({ id, label, required, error, children }) {
  return (
    <div className="field">
      <label className={`field-label${required ? ' is-required' : ''}`} htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

// The parent gives this form a `key` based on the job being edited,
// so React creates a fresh form whenever editing starts or ends.
function JobForm({ jobToEdit, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(jobToEdit));
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  // When editing starts, put the cursor in the first field. The dashboard
  // scrolls the whole form into view, so focusing must not scroll by itself.
  useEffect(() => {
    if (jobToEdit) titleRef.current?.focus({ preventScroll: true });
  }, [jobToEdit]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateJob(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move to the first field that needs fixing
      const first = Object.keys(EMPTY_FORM).find((field) => found[field]);
      e.currentTarget.querySelector(`[name="${first}"]`)?.focus();
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

  // Props shared by every input: name, value, change handler and error wiring
  const inputProps = (field) => ({
    id: `job-${field}`,
    name: field,
    className: 'input',
    value: form[field],
    onChange: handleChange(field),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `job-${field}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} className="job-form" noValidate>
      {jobToEdit && (
        <p className="editing-note">
          <Pencil size={16} aria-hidden="true" />
          <span>
            Editing <strong>{jobToEdit.title || 'Untitled application'}</strong>
            {jobToEdit.company ? ` at ${jobToEdit.company}` : ''}
          </span>
        </p>
      )}
      <Field id="job-title" label="Job title" required error={errors.title}>
        <input
          {...inputProps('title')}
          type="text"
          placeholder="e.g. Frontend Developer"
          aria-required="true"
          ref={titleRef}
        />
      </Field>

      <Field id="job-company" label="Company" required error={errors.company}>
        <input
          {...inputProps('company')}
          type="text"
          placeholder="e.g. Shopify"
          aria-required="true"
        />
      </Field>

      <Field id="job-location" label="Location">
        <input {...inputProps('location')} type="text" placeholder="City or Remote" />
      </Field>

      <div className="job-form-row">
        <Field id="job-appliedDate" label="Applied on" required error={errors.appliedDate}>
          <input {...inputProps('appliedDate')} type="date" aria-required="true" />
        </Field>

        <Field id="job-status" label="Status">
          <select {...inputProps('status')}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {form.status === 'Interview' && (
        <div className="job-form-row">
          <Field
            id="job-interviewDate"
            label="Interview date"
            required
            error={errors.interviewDate}
          >
            <input {...inputProps('interviewDate')} type="date" aria-required="true" />
          </Field>
          <Field
            id="job-interviewTime"
            label="Interview time"
            required
            error={errors.interviewTime}
          >
            <input {...inputProps('interviewTime')} type="time" aria-required="true" />
          </Field>
        </div>
      )}

      <div className="job-form-actions">
        <button type="submit" className="btn btn-primary">
          {jobToEdit ? (
            <Save size={16} aria-hidden="true" />
          ) : (
            <Plus size={16} aria-hidden="true" />
          )}
          {jobToEdit ? 'Save changes' : 'Add application'}
        </button>
        {jobToEdit && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default JobForm;
