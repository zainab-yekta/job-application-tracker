import React, { useEffect, useRef } from 'react';
import { PartyPopper, Trophy, X } from 'lucide-react';
import './StatusPopup.css';

// Accepting an offer asks a real question (keep or clear the list), so it is a
// modal dialog. A new offer is good news that needs no answer, so it is a toast.
function AcceptedOfferDialog({ job, onClose, onDeleteAll }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // showModal traps focus and closes on Escape (fall back where unsupported).
    // No cleanup: calling close() there would fire onClose and hide the dialog
    // straight away in development, where React runs effects twice.
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="offer-dialog card"
      aria-labelledby="offer-dialog-title"
      aria-describedby="offer-dialog-text"
      onClose={onClose}
    >
      <span className="offer-dialog-icon" aria-hidden="true">
        <Trophy size={28} />
      </span>
      <h2 id="offer-dialog-title">You accepted the offer at {job.company}</h2>
      <p id="offer-dialog-text">
        Congratulations, and good luck in your new role! Do you want to keep your applications here,
        or clear the list and start fresh?
      </p>
      <div className="offer-dialog-actions">
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          Keep my list
        </button>
        <button
          type="button"
          className="btn btn-secondary offer-dialog-delete"
          onClick={onDeleteAll}
        >
          Delete all applications
        </button>
      </div>
    </dialog>
  );
}

function OfferToast({ job, onClose }) {
  return (
    <div className="offer-toast card" role="status">
      <span className="offer-toast-icon" aria-hidden="true">
        <PartyPopper size={22} />
      </span>
      <div>
        <p className="offer-toast-title">Congratulations on the offer!</p>
        <p>
          {job.title} at {job.company} made you an offer. Take your time to think it over before you
          accept.
        </p>
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={onClose}
        aria-label="Dismiss offer message"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

// Shown when an application reaches Offer or Accepted Offer
function StatusPopup({ job, onClose, onDeleteAll }) {
  if (job.status === 'Accepted Offer') {
    return <AcceptedOfferDialog job={job} onClose={onClose} onDeleteAll={onDeleteAll} />;
  }
  return <OfferToast job={job} onClose={onClose} />;
}

export default StatusPopup;
