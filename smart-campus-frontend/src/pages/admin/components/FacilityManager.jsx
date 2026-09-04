import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const FacilityManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({
    facilityId: '',
    name: '',
    type: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await api.get('/facilities');
      setFacilities(response.data.data);
    } catch (err) {
      toast.error('Failed to load facilities');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/facilities', formData);
      toast.success('Facility created successfully');
      setFormData({ facilityId: '', name: '', type: '', description: '', location: '' });
      fetchFacilities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create facility');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (facilityId) => {
    if (!window.confirm(`Delete facility ${facilityId}?`)) return;
    try {
      await api.delete(`/facilities/${facilityId}`);
      toast.success('Facility deleted');
      fetchFacilities();
    } catch (err) {
      toast.error('Failed to delete facility');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Facility Management</h2>
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Facility</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="facilityId" value={formData.facilityId} onChange={handleChange} placeholder="Facility ID" className="form-input" required />
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Facility Name" className="form-input" required />
          <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Type (e.g. LAB, LIBRARY)" className="form-input" required />
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location ID" className="form-input" required />
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="form-input md:col-span-2" />
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
              {loading ? 'Adding...' : 'Add Facility'}
            </button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Existing Facilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-4 font-semibold text-text-muted">ID</th>
                <th className="p-4 font-semibold text-text-muted">Name</th>
                <th className="p-4 font-semibold text-text-muted">Type</th>
                <th className="p-4 font-semibold text-text-muted">Location</th>
                <th className="p-4 font-semibold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length > 0 ? facilities.map(f => (
                <tr key={f.id} className="border-b border-border-color">
                  <td className="p-4">{f.facilityId}</td>
                  <td className="p-4">{f.name}</td>
                  <td className="p-4">{f.type}</td>
                  <td className="p-4">{f.location}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(f.facilityId)} className="text-warning hover:underline">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-text-muted">No facilities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacilityManager;
