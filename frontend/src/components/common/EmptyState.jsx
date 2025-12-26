const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div className="empty-state">
      {icon && <div>{icon}</div>}
      {title && <h3>{title}</h3>}
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
    </div>
  );
};

export default EmptyState;
