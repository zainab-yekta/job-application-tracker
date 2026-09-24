import React, { useState, useMemo } from 'react';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatDisplayDate } from '../utils/FormatDate';
import { getUpcomingInterviews } from '../utils/reminders';

function Dashboard({ jobs, onAdd, onDelete, onUpdate }) {
  const [jobToEdit, setJobToEdit] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showNotification, setShowNotification] = useState(true);

  const notificationJobs = useMemo(() => getUpcomingInterviews(jobs), [jobs]);

  const editJob = (job) => {
    setJobToEdit(job);
  };

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

  //export Excel file
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Jobs');

    worksheet.columns = [
      { header: 'Title', key: 'title', width: 20 },
      { header: 'Company', key: 'company', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 15 },
    ];

    jobs.forEach((job) => {
      worksheet.addRow({
        title: job.title,
        company: job.company,
        status: job.status,
        date: job.date,
        time: job.interviewTime,
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${now.getFullYear()}`;
    const fileName = `JOBs ${dateStr}.xlsx`;

    saveAs(new Blob([buffer]), fileName);
  };

  //Export pdf file
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Job Application Report', 14, 10);

    const tableColumn = ['Title', 'Company', 'Status', 'Date', 'Time'];
    const tableRows = [];

    jobs.forEach((job) => {
      tableRows.push([job.title, job.company, job.status, job.date, job.interviewTime]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${now.getFullYear()}`;
    doc.save(`JOBs ${dateStr}.pdf`);
  };

  const search = searchTerm.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filter === 'All' || job.status === filter;
    const matchesSearch =
      (job.title || '').toLowerCase().includes(search) ||
      (job.company || '').toLowerCase().includes(search);
    const matchesDate = !dateFilter || job.date === dateFilter;

    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <div className="app-container">
      <h1>Job Application Tracker</h1>

      {/* ✅ Notification Section */}
      {showNotification && notificationJobs.length > 0 && (
        <div className="notification">
          <strong>Upcoming Interviews:</strong>
          <ul>
            {notificationJobs.map((job) => (
              <li key={job.id}>
                {job.title} at {job.company} on {formatDisplayDate(job.date)}, {job.interviewTime}
              </li>
            ))}
          </ul>
          <button className="dismiss-btn" onClick={() => setShowNotification(false)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
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
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
          <option value="Accepted Offer">Accepted Offer</option>
        </select>
      </div>

      <div className="date-filter">
        <label>Filter by Date: </label>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      <div className="export-buttons">
        <button onClick={handleExportExcel}>Export to Excel</button>
        <button onClick={handleExportPDF}>Export to PDF</button>
      </div>

      <JobList jobs={filteredJobs} onDelete={handleDelete} onEdit={editJob} />
    </div>
  );
}

export default Dashboard;
