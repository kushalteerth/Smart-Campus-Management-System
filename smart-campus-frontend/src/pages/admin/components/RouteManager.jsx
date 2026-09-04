import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const RouteManager = () => {
  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    routeId: '',
    sourceLocationId: '',
    destinationLocationId: '',
    distance: '',
    description: '',
    bidirectional: true,
  });

  useEffect(() => {
    fetchRoutes();
    fetchLocations();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data.data || []);
    } catch {
      toast.error('Failed to load routes');
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await api.get('/locations');
      setLocations(res.data.data || []);
    } catch {
      console.error('Failed to load locations');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sourceLocationId === formData.destinationLocationId) {
      toast.warning('Source and destination cannot be the same location');
      return;
    }
    setLoading(true);
    try {
      await api.post('/routes', { ...formData, distance: parseFloat(formData.distance) });
      toast.success('Route created successfully');
      setFormData({ routeId: '', sourceLocationId: '', destinationLocationId: '', distance: '', description: '', bidirectional: true });
      setShowForm(false);
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create route');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm(`Delete route ${routeId}? This will affect navigation paths.`)) return;
    try {
      await api.delete(`/routes/${routeId}`);
      toast.success('Route deleted and graph updated');
      fetchRoutes();
    } catch (err) {
      toast.error('Failed to delete route');
    }
  };

  const getLocationName = (id) => {
    const loc = locations.find(l => l.locationId === id);
    return loc ? loc.name : id;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Route Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add Route'}
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-start gap-2">
        <span>ℹ️</span>
        <span>Routes define walkway connections between campus locations used by the <strong>Dijkstra</strong> shortest-path algorithm. Adding/removing routes rebuilds the campus graph.</span>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 border-l-4 border-primary">
          <h3 className="text-xl font-semibold mb-4">Add New Route</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Route ID</label>
              <input
                type="text"
                name="routeId"
                value={formData.routeId}
                onChange={handleChange}
                placeholder="e.g. R_16"
                className="form-input mt-1"
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Distance (meters)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g. 150"
                className="form-input mt-1"
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Source Location</label>
              <select name="sourceLocationId" value={formData.sourceLocationId} onChange={handleChange} className="mt-1 form-input" required>
                <option value="">-- Select source --</option>
                {locations.map(loc => (
                  <option key={loc.locationId} value={loc.locationId}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Destination Location</label>
              <select name="destinationLocationId" value={formData.destinationLocationId} onChange={handleChange} className="mt-1 form-input" required>
                <option value="">-- Select destination --</option>
                {locations.map(loc => (
                  <option key={loc.locationId} value={loc.locationId}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Covered walkway between wings"
                className="form-input mt-1"
              />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                id="bidirectional"
                name="bidirectional"
                checked={formData.bidirectional}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="bidirectional" className="text-sm font-medium cursor-pointer">
                Bidirectional route (walkable both ways)
              </label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
                {loading ? 'Creating...' : '🔗 Create Route'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Campus Route Network ({routes.length} routes)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-3 font-semibold text-text-muted text-sm">Route ID</th>
                <th className="p-3 font-semibold text-text-muted text-sm">From</th>
                <th className="p-3 font-semibold text-text-muted text-sm">To</th>
                <th className="p-3 font-semibold text-text-muted text-sm">Distance</th>
                <th className="p-3 font-semibold text-text-muted text-sm">Type</th>
                <th className="p-3 font-semibold text-text-muted text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.length > 0 ? routes.map(r => (
                <tr key={r.routeId} className="border-b border-border-color hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono text-xs font-semibold text-primary">{r.routeId}</td>
                  <td className="p-3 text-sm">{r.sourceLocationName || getLocationName(r.sourceLocationId)}</td>
                  <td className="p-3 text-sm">→ {r.destinationLocationName || getLocationName(r.destinationLocationId)}</td>
                  <td className="p-3 text-sm font-semibold">{r.distance}m</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.bidirectional ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {r.bidirectional ? '↔ Bidirectional' : '→ One-way'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(r.routeId)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">
                    <div className="text-3xl mb-2">🔗</div>
                    <div>No routes defined yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteManager;
