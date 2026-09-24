import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, Upload } from 'lucide-react';
import { downloadBackup, parseBackup, MAX_BACKUP_BYTES } from '../utils/backup';

// Download all applications as a JSON file, or load them back from one
function BackupControls({ jobs, onImport }) {
  const fileInput = useRef(null);
  const [message, setMessage] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    // Reset so choosing the same file again still triggers a change
    e.target.value = '';
    if (!file) return;

    if (file.size > MAX_BACKUP_BYTES) {
      setMessage({ type: 'error', text: 'This file is too large to be a backup from this app.' });
      return;
    }

    try {
      const imported = parseBackup(await file.text());
      if (imported.length === 0) {
        setMessage({ type: 'error', text: 'This backup has no applications in it.' });
        return;
      }
      const plural = imported.length === 1 ? 'application' : 'applications';
      if (
        !window.confirm(
          `Restore ${imported.length} ${plural}? Saved applications with the same ID will be replaced.`,
        )
      ) {
        setMessage(null);
        return;
      }
      onImport(imported);
      setMessage({ type: 'success', text: `Restored ${imported.length} ${plural}.` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="backup-controls">
      <div className="tool-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => downloadBackup(jobs)}
          disabled={jobs.length === 0}
        >
          <Download size={16} aria-hidden="true" />
          Download backup
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInput.current?.click()}
        >
          <Upload size={16} aria-hidden="true" />
          Restore backup
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        className="sr-only"
        aria-label="Choose a backup file to restore"
        tabIndex={-1}
      />
      {message && (
        <p
          className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.type === 'error' ? (
            <AlertCircle size={18} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={18} aria-hidden="true" />
          )}
          {message.text}
        </p>
      )}
    </div>
  );
}

export default BackupControls;
