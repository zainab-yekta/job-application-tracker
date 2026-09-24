import React, { useState, useMemo } from 'react';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import { formatDisplayDate } from '../utils/formatDate';
import { getUpcomingInterviews } from '../utils/reminders';
import { filterJobs } from '../utils/filterJobs';
import { exportToExcel, exportToPDF } from '../utils/exportJobs';
import { STATUSES } from '../constants/statuses';

function Dashboard({ jobs, onAdd, onDelete, onUpdate }) {
  const [jobToEdit, setJobToEdit] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [exportError, setExportError] = useState('');

  const notificationJobs = useMemo(() => getUpcomingInterviews(jobs), [jobs]);
  const filteredJobs = filterJobs(jobs, { status: filter, search: searchTerm, date: dateFilter });

  const handleSubmit = (job) => {
    if (jobToEdit) {
      onUpdate(job);
      setJobToEdit(null);
    } else {
      onAdd(job);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this application?')) {
      onDelete(id);
      if (jobToEdit?.id === id) setJobToEdit(null);
    }
  };

  const handleExport = async (exporter) => {
    setExportError('');
    try {
      await exporter(jobs);
    } catch {
      setExportError('The export could not be created. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <h1>Job Application Tracker</h1>

      {showNotification && notificationJobs.length > 0 && (
        <div className="notification" role="status">
          <strong>Upcoming Interviews:</strong>
          <ul>
            {notificationJobs.map((job) => (
              <li key={job.id}>
                {job.title} at {job.company} on {formatDisplayDate(job.interviewDate)},{' '}
                {job.interviewTime}
              </li>
            ))}
          </ul>
          <button className="dismiss-btn" onClick={() => setShowNotification(false)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="search-bar">
        <label className="sr-only" htmlFor="search">
          Search by title or company
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search by title or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <JobForm
        key={jobToEdit ? jobToEdit.id : 'new'}
        onSubmit={handleSubmit}
        onCancel={() => setJobToEdit(null)}
        jobToEdit={jobToEdit}
      />

      <div className="status-filter">
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select id="statusFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="date-filter">
        <label htmlFor="dateFilter">Filter by Date: </label>
        <input
          id="dateFilter"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="export-buttons">
        <button onClick={() => handleExport(exportToExcel)}>Export to Excel</button>
        <button onClick={() => handleExport(exportToPDF)}>Export to PDF</button>
      </div>
      {exportError && (
        <p className="form-errors" role="alert">
          {exportError}
        </p>
      )}

      <JobList jobs={filteredJobs} onDelete={handleDelete} onEdit={setJobToEdit} />
    </div>
  );
}

export default Dashboard;
