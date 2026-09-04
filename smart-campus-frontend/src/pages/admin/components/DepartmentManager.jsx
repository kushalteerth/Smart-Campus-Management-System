import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    departmentId: '',
    facilities: '',
    purpose: '',
    timing: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
    } catch (err) {
      toast.error('Failed to load departments');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/departments', formData);
      toast.success('Department created successfully');
      setFormData({ departmentId: '', facilities: '', purpose: '', timing: '' });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (departmentId) => {
    if (!window.confirm(`Delete department ${departmentId}?`)) return;
    try {
      await api.delete(`/departments/${departmentId}`);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Department Management</h2>
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Department</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="departmentId" value={formData.departmentId} onChange={handleChange} placeholder="Department ID" className="form-input" required />
          <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} placeholder="Facilities (comma separated)" className="form-input md:col-span-2" />
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose" className="form-input" />
          <input type="text" name="timing" value={formData.timing} onChange={handleChange} placeholder="Timing" className="form-input" />
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
              {loading ? 'Adding...' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Existing Departments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-4 font-semibold text-text-muted">ID</th>
                <th className="p-4 font-semibold text-text-muted">Facilities</th>
                <th className="p-4 font-semibold text-text-muted">Purpose</th>
                <th className="p-4 font-semibold text-text-muted">Timing</th>
                <th className="p-4 font-semibold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? departments.map(d => (
                <tr key={d.id} className="border-b border-border-color">
                  <td className="p-4">{d.departmentId}</td>
                  <td className="p-4">{d.facilities}</td>
                  <td className="p-4">{d.purpose}</td>
                  <td className="p-4">{d.timing}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(d.departmentId)} className="text-warning hover:underline">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-text-muted">No departments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManager;
