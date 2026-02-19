import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>{message}</p>
      </div>
    </div>
  );
};

export default Loading;