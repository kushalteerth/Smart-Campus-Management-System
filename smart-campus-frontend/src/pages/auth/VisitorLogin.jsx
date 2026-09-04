import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const VisitorLogin = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { visitorLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await visitorLogin(name);
      if (user) {
        toast.success(`Welcome to campus, ${name}!`);
        navigate('/visitor');
      } else {
        toast.error('Failed to create visitor session.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 rounded-2xl glass-panel">
        <h2 className="text-3xl font-bold mb-2 text-center text-secondary">Visitor Access</h2>
        <p className="text-center text-text-muted mb-6">Enter your name to explore the campus map and routes.</p>
        
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="John Doe"
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-6" style={{ backgroundColor: 'var(--secondary)' }} disabled={loading}>
            {loading ? 'Entering...' : 'Enter Campus'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-text-muted">Staff or Student? <Link to="/login" className="text-primary font-medium">Login Here</Link></p>
          <p className="mt-2 text-text-muted"><Link to="/" className="text-text-muted hover:text-primary">Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VisitorLogin;
