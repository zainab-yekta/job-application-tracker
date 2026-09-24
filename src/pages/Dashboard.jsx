import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CalendarClock,
  FileSpreadsheet,
  FileText,
  Hourglass,
  Inbox,
  Search,
  SearchX,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import BackupControls from '../components/BackupControls';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { formatDisplayDate } from '../utils/formatDate';
import { getUpcomingInterviews } from '../utils/reminders';
import { filterJobs } from '../utils/filterJobs';
import { exportToExcel, exportToPDF } from '../utils/exportJobs';
import { STATUSES, isOfferStatus } from '../constants/statuses';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import './Dashboard.css';

function Dashboard({ jobs, saveFailed, onAdd, onDelete, onUpdate, onImport }) {
  const [jobToEdit, setJobToEdit] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [exportError, setExportError] = useState('');
  const formPanelRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const notificationJobs = useMemo(() => getUpcomingInterviews(jobs), [jobs]);
  const filteredJobs = filterJobs(jobs, { status: filter, search: searchTerm, date: dateFilter });
  const hasFilters = filter !== 'All' || searchTerm.trim() !== '' || dateFilter !== '';

  const counts = {
    total: jobs.length,
    waiting: jobs.filter((job) => job.status === 'Applied').length,
    interviews: jobs.filter((job) => job.status === 'Interview').length,
    offers: jobs.filter((job) => isOfferStatus(job.status)).length,
  };

  const clearFilters = () => {
    setFilter('All');
    setSearchTerm('');
    setDateFilter('');
  };

  // When editing starts, bring the form into view if its heading is not visible
  // (on phones the form sits above the list, so it is usually off screen)
  const editingId = jobToEdit?.id;
  useEffect(() => {
    if (editingId === undefined) return;
    const panel = formPanelRef.current;
    if (!panel) return;
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight ?? 0;
    const { top } = panel.getBoundingClientRect();
    if (top < navbarHeight || top > window.innerHeight - 120) {
      panel.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [editingId, reduceMotion]);

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

  const emptyState = hasFilters ? (
    <EmptyState
      icon={SearchX}
      title="No matches"
      text="No applications match your search or filters."
      action={
        <button type="button" className="btn btn-secondary" onClick={clearFilters}>
          Clear filters
        </button>
      }
    />
  ) : (
    <EmptyState
      icon={Inbox}
      title="No applications yet"
      text="Add your first one with the form. It only takes a few seconds."
    />
  );

  return (
    <main className="dashboard container">
      <header className="page-header">
        <h1>Your applications</h1>
        <p>Add new applications, keep their status up to date and export your list.</p>
      </header>

      {saveFailed && (
        <p className="alert alert-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          Your latest change could not be saved in this browser. Storage may be full or turned off,
          so download a backup before closing the page.
        </p>
      )}

      {showNotification && notificationJobs.length > 0 && (
        <div className="alert alert-warning reminder" role="status">
          <CalendarClock size={20} aria-hidden="true" />
          <div className="reminder-body">
            <strong>Upcoming interviews</strong>
            <ul>
              {notificationJobs.map((job) => (
                <li key={job.id}>
                  {job.title} at {job.company} on {formatDisplayDate(job.interviewDate)},{' '}
                  {job.interviewTime}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon reminder-dismiss"
            onClick={() => setShowNotification(false)}
            aria-label="Dismiss interview reminder"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      <section className="stats" aria-label="Summary">
        <StatCard icon={Briefcase} label="Total" value={counts.total} tone="primary" />
        <StatCard icon={Hourglass} label="Waiting to hear" value={counts.waiting} tone="applied" />
        <StatCard icon={Users} label="Interviews" value={counts.interviews} tone="interview" />
        <StatCard icon={Trophy} label="Offers" value={counts.offers} tone="offer" />
      </section>

      <div className="dashboard-layout">
        <section
          ref={formPanelRef}
          className="panel card dashboard-form"
          aria-labelledby="form-title"
        >
          <h2 id="form-title" className="panel-title">
            {jobToEdit ? 'Edit application' : 'Add application'}
          </h2>
          <JobForm
            key={jobToEdit ? jobToEdit.id : 'new'}
            onSubmit={handleSubmit}
            onCancel={() => setJobToEdit(null)}
            jobToEdit={jobToEdit}
          />
        </section>

        <section className="dashboard-list" aria-labelledby="list-title">
          <h2 id="list-title" className="sr-only">
            Applications
          </h2>
          <div className="toolbar">
            <div className="field toolbar-search">
              <label className="sr-only" htmlFor="search">
                Search by title or company
              </label>
              <div className="input-with-icon">
                <Search size={18} aria-hidden="true" />
                <input
                  id="search"
                  className="input"
                  type="search"
                  placeholder="Search by title or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="sr-only" htmlFor="statusFilter">
                Filter by status
              </label>
              <select
                id="statusFilter"
                className="input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="sr-only" htmlFor="dateFilter">
                Filter by date
              </label>
              <input
                id="dateFilter"
                className="input"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="list-summary">
            <p aria-live="polite">
              {hasFilters
                ? `Showing ${filteredJobs.length} of ${jobs.length}`
                : `${jobs.length} ${jobs.length === 1 ? 'application' : 'applications'}`}
            </p>
            {hasFilters && (
              <button type="button" className="btn btn-ghost" onClick={clearFilters}>
                <X size={16} aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>

          <JobList
            jobs={filteredJobs}
            editingId={jobToEdit?.id}
            onDelete={handleDelete}
            onEdit={setJobToEdit}
            empty={emptyState}
          />
        </section>

        <section className="panel card dashboard-tools" aria-labelledby="tools-title">
          <h2 id="tools-title" className="panel-title">
            Export and backup
          </h2>
          <p className="panel-text">
            Download your list, or save a backup file you can restore in another browser.
          </p>
          <div className="tool-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleExport(exportToExcel)}
              disabled={jobs.length === 0}
            >
              <FileSpreadsheet size={16} aria-hidden="true" />
              Export to Excel
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleExport(exportToPDF)}
              disabled={jobs.length === 0}
            >
              <FileText size={16} aria-hidden="true" />
              Export to PDF
            </button>
          </div>
          {exportError && (
            <p className="alert alert-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              {exportError}
            </p>
          )}
          <BackupControls jobs={jobs} onImport={onImport} />
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
