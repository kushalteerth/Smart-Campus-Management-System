import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const OperationsManager = () => {
  const [operations, setOperations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOp, setEditingOp] = useState(null);
  const [formData, setFormData] = useState({
    operationId: '',
    name: '',
    description: '',
    status: 'ACTIVE',
    locationId: '',
    operatingHours: '',
  });

  useEffect(() => {
    fetchOperations();
    fetchLocations();
  }, []);

  const fetchOperations = async () => {
    try {
      const res = await api.get('/operations');
      setOperations(res.data.data || []);
    } catch {
      toast.error('Failed to load operations');
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (op) => {
    setEditingOp(op.operationId);
    setFormData({
      operationId: op.operationId,
      name: op.name,
      description: op.description || '',
      status: op.status || 'ACTIVE',
      locationId: op.locationId || '',
      operatingHours: op.operatingHours || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingOp) {
        await api.put(`/operations/${editingOp}`, formData);
        toast.success('Operation updated successfully');
      } else {
        await api.post('/operations', formData);
        toast.success('Operation created successfully');
      }
      setFormData({ operationId: '', name: '', description: '', status: 'ACTIVE', locationId: '', operatingHours: '' });
      setShowForm(false);
      setEditingOp(null);
      fetchOperations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save operation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (operationId) => {
    if (!window.confirm(`Delete operation ${operationId}?`)) return;
    try {
      await api.delete(`/operations/${operationId}`);
      toast.success('Operation deleted');
      fetchOperations();
    } catch {
      toast.error('Failed to delete operation');
    }
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    INACTIVE: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    MAINTENANCE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Operations Management</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingOp(null); setFormData({ operationId: '', name: '', description: '', status: 'ACTIVE', locationId: '', operatingHours: '' }); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add Operation'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 border-l-4 border-secondary">
          <h3 className="text-xl font-semibold mb-4">{editingOp ? 'Edit Operation' : 'Add New Operation'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Operation ID</label>
              <input
                type="text"
                name="operationId"
                value={formData.operationId}
                onChange={handleChange}
                placeholder="e.g. OP_PRINTING"
                className="form-input mt-1"
                required
                disabled={!!editingOp}
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Library Printing Service"
                className="form-input mt-1"
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-input mt-1">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Under Maintenance</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Location</label>
              <select name="locationId" value={formData.locationId} onChange={handleChange} className="form-input mt-1">
                <option value="">-- Select location --</option>
                {locations.map(loc => (
                  <option key={loc.locationId} value={loc.locationId}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Operating Hours</label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="e.g. 09:00 AM - 05:00 PM"
                className="form-input mt-1"
              />
            </div>
            <div className="form-group mb-0 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the operation..."
                className="form-input mt-1 min-h-[80px] resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
                {loading ? 'Saving...' : editingOp ? '✓ Update Operation' : '+ Create Operation'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Campus Operations ({operations.length})</h3>
        {operations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {operations.map(op => (
              <div key={op.operationId} className="border border-border-color rounded-xl p-4 hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-bold text-base">{op.name}</h4>
                    <span className="text-xs font-mono text-text-muted">{op.operationId}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${statusColors[op.status] || statusColors.INACTIVE}`}>
                    {op.status}
                  </span>
                </div>
                {op.description && <p className="text-sm text-text-muted mb-3 line-clamp-2">{op.description}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                  {op.locationName && <span>📍 {op.locationName}</span>}
                  {op.operatingHours && <span>🕒 {op.operatingHours}</span>}
                </div>
                <div className="flex gap-3 mt-3 pt-3 border-t border-border-color">
                  <button onClick={() => handleEdit(op)} className="text-xs text-primary hover:underline font-semibold">Edit</button>
                  <button onClick={() => handleDelete(op.operationId)} className="text-xs text-red-500 hover:underline font-semibold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-text-muted">
            <div className="text-4xl mb-3">⚙️</div>
            <div>No operations configured yet.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsManager;
