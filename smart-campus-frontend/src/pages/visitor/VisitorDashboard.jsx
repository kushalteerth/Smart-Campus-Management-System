import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { icon: '🗺️', label: 'Campus Map & Route Finder', to: '/map', desc: 'Find shortest paths between buildings' },
  { icon: '🔍', label: 'Explore Campus', to: '/campus', desc: 'Browse locations, facilities & services' },
];

const VisitorDashboard = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [operations, setOperations] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [locRes, opRes] = await Promise.all([
        api.get('/locations'),
        api.get('/operations'),
      ]);
      setLocations((locRes.data.data || []).slice(0, 6));
      setOperations((opRes.data.data || []).filter(op => op.status === 'ACTIVE').slice(0, 4));
    } catch (err) {
      console.error('Failed to load visitor data', err);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmittingFeedback(true);
    try {
      await api.put(`/visitors/${user.userId}/feedback`, { feedback });
      toast.success('Thank you for your feedback! 🙏');
      setFeedback('');
    } catch {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 40%, #FBBF24 100%)' }}>
        <div className="relative z-10">
          <div className="text-5xl mb-3">👋</div>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-amber-100 text-sm max-w-xl">
            You're visiting Smart Campus as a guest. Explore campus locations, find navigation routes,
            and discover services available during your visit.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur">
              👤 Visitor ID: {user?.userId}
            </span>
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur">
              🕒 {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
        <div className="absolute -bottom-12 -right-4 w-60 h-60 rounded-full opacity-10" style={{ background: 'rgba(255,255,255,0.5)' }} />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-bold mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 no-underline group"
              style={{ textDecoration: 'none' }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</div>
              <h3 className="font-bold text-base mb-1">{link.label}</h3>
              <p className="text-sm text-text-muted">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Campus Services */}
      {operations.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            ⚙️ Active Campus Services
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">{operations.length} active</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {operations.map(op => (
              <div key={op.operationId} className="card p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 text-lg shrink-0">⚙️</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{op.name}</h4>
                  {op.operatingHours && <p className="text-xs text-text-muted mt-0.5">🕒 {op.operatingHours}</p>}
                  {op.locationName && <p className="text-xs text-text-muted">📍 {op.locationName}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campus Locations Preview */}
      {locations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">📍 Campus Locations</h2>
            <Link to="/campus" className="text-sm text-primary font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {locations.map(loc => (
              <div key={loc.locationId} className="card p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-sm">{loc.name}</h4>
                {loc.description && <p className="text-xs text-text-muted mt-1 line-clamp-2">{loc.description}</p>}
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-text-muted">
                  {loc.building && <span>🏢 {loc.building}</span>}
                  {loc.openingTime && <span>🕒 {loc.openingTime}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitor Feedback Form */}
      <div className="card p-6 border border-amber-200 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-900/5">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <span>💬</span> Share Your Experience
        </h2>
        <p className="text-sm text-text-muted mb-4">Your feedback helps us improve campus services for all visitors.</p>
        <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-3">
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Tell us about your visit experience, suggestions, or any issues you encountered..."
            className="form-input min-h-[100px] resize-none text-sm"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary text-sm px-6"
              style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
              disabled={submittingFeedback || !feedback.trim()}
            >
              {submittingFeedback ? 'Submitting...' : '📤 Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitorDashboard;
