import React from 'react';

const JobItem = ({ job, onDelete, onUpdateStatus }) => {
    const handleStatusChange = (e) => {
        onUpdateStatus(job.id, e.target.value);
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>{job.title} at {job.company}</h3>
            <p><strong>Location:</strong> {job.location || 'N/A'}</p>
            <p><strong>Applied On:</strong> {job.date || 'N/A'}</p>
            <p>
                <strong>Status:</strong>{' '}
                <select value={job.status} onChange={handleStatusChange}>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Rejected</option>
                    <option>Offer</option>
                    <option>Accepted Offer</option>
                </select>
            </p>
            <button onClick={() => onDelete(job.id)} style={{ marginTop: '8px', color: 'white', backgroundColor: 'red', border: 'none', padding: '6px 12px', borderRadius: '4px' }}>
                Delete
            </button>
        </div>
    );
};

export default JobItem;
