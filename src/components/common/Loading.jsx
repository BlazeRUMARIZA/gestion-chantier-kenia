const Loading = ({ message = 'Chargement...' }) => {
  return (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        {message && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
