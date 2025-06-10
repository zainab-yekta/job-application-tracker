import React, { useState, useEffect } from 'react';

function JobForm({ onAdd, onUpdate, jobToEdit, onSubmit }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Applied'); // default
  const [interviewTime, setInterviewTime] = useState('');

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setCompany(jobToEdit.company);
      setLocation(jobToEdit.location);
      setDate(jobToEdit.date);
      setStatus(jobToEdit.status);
      setInterviewTime(jobToEdit.interviewTime || '');
    } 
    else {
      // reset form
      setTitle('');
      setCompany('');
      setStatus('Applied');
      setDate('');
      setInterviewTime('');
    }
  }, [jobToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company || !date) {
      alert('Please fill in title, company and date');
      return;
    }
    if (status === 'Interview' && !interviewTime) {
      alert('Please set interview time for status Interview');
      return;
    }

    const jobData = {
      id: jobToEdit ? jobToEdit.id : Date.now(),
      title,
      company,
      location,
      date,       // we continue using `date` as interview date
      status,
      interviewTime: status === 'Interview' ? interviewTime : '',
    };

    //jobToEdit ? onUpdate(jobData) : onAdd(jobData);
    onSubmit(jobData);

    // Reset form
    setTitle('');
    setCompany('');
    setLocation('');
    setDate('');
    setStatus('Applied');
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
        <option value="Accepted Offer">Accepted Offer</option>
      </select>
      {/* Time input only if status is Interview */}
      {status === 'Interview' && (
        <input
          type="time"
          value={interviewTime}
          onChange={(e) => setInterviewTime(e.target.value)}
          required={status === 'Interview'}
        />
      )}
      <button type="submit">{jobToEdit ? 'Save' : 'Add Job'}</button>
    </form>
  );
}

export default JobForm;
