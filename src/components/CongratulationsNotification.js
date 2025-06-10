import React from 'react';
import './CongratulationsNotification.css';

function CongratulationsNotification({ onKeepTracking, onCloseJob }) {
  return (
    <div className="congrats-popup">
      <h3>🎉 Congratulations!</h3>
      <p>You’ve accepted a job offer. Do you want to keep tracking it or close it?</p>
      <div className="congrats-buttons">
        <button onClick={onKeepTracking}>✅ Keep Tracking</button>
        <button onClick={onCloseJob}>❌ Close Job</button>
      </div>
    </div>
  );
}

export default CongratulationsNotification;
