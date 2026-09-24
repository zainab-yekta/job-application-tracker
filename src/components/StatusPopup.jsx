import React from 'react';

// Shown when an application reaches Offer or Accepted Offer
function StatusPopup({ job, onClose, onDeleteAll }) {
  if (job.status === 'Accepted Offer') {
    return (
      <div className="congrats-popup2" role="dialog" aria-live="polite">
        <p>
          Congratulations again, finally you accepted the offer at {job.company}, and you are
          selected. So you will start your job soon. Best of luck for your new journey. For now, let
          me know if you want to continue with us in job searching and want us to keep the data
          tracking or do you want to clear your applied job tracking?
        </p>
        <div>
          <button onClick={onClose}>Keep It</button>
          <button onClick={onDeleteAll}>Delete All</button>
        </div>
      </div>
    );
  }

  return (
    <div className="congrats-popup2" role="dialog" aria-live="polite">
      <p>Waoo, you got an offer, think about this offer and then accept it. Congratulations.</p>
      <button onClick={onClose}>Dismiss</button>
    </div>
  );
}

export default StatusPopup;
