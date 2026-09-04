import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    locationId: '',
    department: '',
    distance: '',
    building: '',
    floor: '',
    status: '',
    openingTime: '',
    closingTime: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations');
      setLocations(response.data.data);
    } catch (err) {
      toast.error('Failed to load locations');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/locations', formData);
      toast.success('Location created successfully');
      setFormData({ locationId: '', department: '', distance: '', building: '', floor: '', status: '', openingTime: '', closingTime: '' });
      fetchLocations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create location');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (locationId) => {
    if (!window.confirm(`Delete location ${locationId}?`)) return;
    try {
      await api.delete(`/locations/${locationId}`);
      toast.success('Location deleted');
      fetchLocations();
    } catch (err) {
      toast.error('Failed to delete location');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Location Management</h2>
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Location</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="locationId" value={formData.locationId} onChange={handleChange} placeholder="Location ID" className="form-input" required />
          <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="form-input" />
          <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} placeholder="Distance" className="form-input" />
          <input type="text" name="building" value={formData.building} onChange={handleChange} placeholder="Building" className="form-input" />
          <input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" className="form-input" />
          <input type="text" name="status" value={formData.status} onChange={handleChange} placeholder="Status (e.g. OPEN)" className="form-input" />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-muted">Opening Time</label>
            <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="form-input" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-muted">Closing Time</label>
            <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="form-input" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
              {loading ? 'Adding...' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Existing Locations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-4 font-semibold text-text-muted">ID</th>
                <th className="p-4 font-semibold text-text-muted">Dept</th>
                <th className="p-4 font-semibold text-text-muted">Distance</th>
                <th className="p-4 font-semibold text-text-muted">Building</th>
                <th className="p-4 font-semibold text-text-muted">Floor</th>
                <th className="p-4 font-semibold text-text-muted">Status & Time</th>
                <th className="p-4 font-semibold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length > 0 ? locations.map(l => (
                <tr key={l.id} className="border-b border-border-color">
                  <td className="p-4">{l.locationId}</td>
                  <td className="p-4">{l.department}</td>
                  <td className="p-4">{l.distance}</td>
                  <td className="p-4">{l.building}</td>
                  <td className="p-4">{l.floor}</td>
                  <td className="p-4">{l.status} {l.openingTime}-{l.closingTime}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(l.locationId)} className="text-warning hover:underline">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-text-muted">No locations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LocationManager;
