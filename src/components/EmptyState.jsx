import React from 'react';
import './EmptyState.css';

// Shown instead of a list or chart when there is nothing to show yet
function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state card">
      <span className="empty-state-icon" aria-hidden="true">
        <Icon size={28} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export default EmptyState;
