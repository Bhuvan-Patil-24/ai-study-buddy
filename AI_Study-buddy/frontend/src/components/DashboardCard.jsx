import React from 'react';

const DashboardCard = ({ title, icon, content, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch(variant) {
      case 'primary':
        return 'bg-primary-50 border-primary-200';
      case 'success':
        return 'bg-success-100 border-success-200';
      case 'warning':
        return 'bg-warning-100 border-warning-200';
      default:
        return 'bg-white border-neutral-200';
    }
  };

  return (
    <div className={`card dashboard-card ${getVariantStyles()}`}>
      <div className="dashboard-card-header">
        <span className="dashboard-card-icon">{icon}</span>
        <h3 className="dashboard-card-title">{title}</h3>
      </div>
      <div className="dashboard-card-content">
        {content}
      </div>
    </div>
  );
};

export default DashboardCard;