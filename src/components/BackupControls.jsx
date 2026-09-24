import React, { useRef, useState } from 'react';
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
      <button type="button" onClick={() => downloadBackup(jobs)} disabled={jobs.length === 0}>
        Download backup
      </button>
      <button type="button" onClick={() => fileInput.current?.click()}>
        Restore backup
      </button>
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
          className={message.type === 'error' ? 'form-errors' : 'backup-success'}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

export default BackupControls;
