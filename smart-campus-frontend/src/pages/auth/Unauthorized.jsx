import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="card w-full max-w-md p-8 rounded-2xl glass-panel">
        <div className="text-danger text-5xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="text-text-muted mb-8">
          You do not have permission to view this page.
        </p>
        <Link to="/" className="btn-primary px-6 py-2 rounded-full">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
