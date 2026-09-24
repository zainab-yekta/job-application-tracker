import React from 'react';
import './StatCard.css';

// A number with a label and an icon, used for summaries on the dashboard and analytics
function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  return (
    <div className={`stat-card card stat-${tone}`}>
      <span className="stat-icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
