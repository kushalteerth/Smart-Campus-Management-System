import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const AdminManager = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [adminDetails, setAdminDetails] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    username: '',
    password: '',
    department: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
    if (user?.userId) {
      fetchAdminDetails(user.userId);
    }
  }, [user]);

  const fetchAdminDetails = async (id) => {
    try {
      const response = await api.get(`/admin/admins/${id}`);
      if (response.data && response.data.data) {
        setAdminDetails(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin profile', err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data.data);
    } catch (err) {
      toast.error('Failed to load admins');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/admins', formData);
      toast.success('Admin created successfully');
      setFormData({ userId: '', fullName: '', username: '', password: '', department: '', email: '' });
      setShowAddForm(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (userId === user?.userId) {
      toast.warning('You cannot delete your own admin account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete admin ${userId}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/admin/admins/${userId}`);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (err) {
      toast.error('Failed to delete admin');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Admin Profile & Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className={showAddForm ? "btn-secondary" : "btn-primary"}
        >
          {showAddForm ? 'Close Form' : '+ Add New Admin'}
        </button>
      </div>

      {/* Admin Information Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">Welcome to the Admin Portal</h3>
          <p className="text-text-muted mb-4 leading-relaxed">
            As a System Administrator, you hold full privileges to oversee and manage the Smart Campus infrastructure. Your core responsibilities include managing user accounts (Students & fellow Admins), orchestrating the campus directory (Locations, Departments, Facilities), controlling the Route Network logic, and managing academic Timetables and campus Operations. 
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">Full Access</span>
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">Route Management</span>
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">User Provisioning</span>
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">System Configuration</span>
          </div>
        </div>

        {/* My Profile Card */}
        <div className="col-span-1 card p-6 border-l-4 border-l-primary flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-4">
            🛡️
          </div>
          <h3 className="text-xl font-bold text-text-main">{adminDetails ? adminDetails.fullName : 'Loading...'}</h3>
          <p className="text-primary font-medium mb-1">System Administrator</p>
          {adminDetails && (
            <div className="text-sm text-text-muted space-y-1 mt-2 w-full bg-background-alt p-3 rounded-lg text-left">
              <p><span className="font-semibold">ID:</span> {adminDetails.userId}</p>
              <p><span className="font-semibold">Dept:</span> {adminDetails.department}</p>
              <p className="truncate" title={adminDetails.email}><span className="font-semibold">Email:</span> {adminDetails.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <div className="card p-6 border border-primary/20 bg-background-alt/50 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-primary">Provision New Administrator</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin ID</label>
              <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="e.g. A002" className="form-input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="form-input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe_admin" className="form-input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@smartcampus.edu" className="form-input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="IT Operations" className="form-input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Required: 1 Upper, 1 Lower, 1 Num (Max 8 chars)" 
                className="form-input w-full" 
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,8}$" 
                title="Max 8 characters, at least 1 uppercase, 1 lowercase, 1 number"
                required 
              />
            </div>
            <div className="md:col-span-2 mt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary min-w-[150px]" disabled={loading}>
                {loading ? 'Provisioning...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin List Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-border-color bg-background-alt flex justify-between items-center">
          <h3 className="text-xl font-semibold">Authorized Administrators</h3>
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            Total: {admins.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color bg-background-alt/30">
                <th className="p-4 font-semibold text-text-muted">User ID</th>
                <th className="p-4 font-semibold text-text-muted">Name</th>
                <th className="p-4 font-semibold text-text-muted">Username</th>
                <th className="p-4 font-semibold text-text-muted">Department</th>
                <th className="p-4 font-semibold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? admins.map(a => (
                <tr key={a.id} className="border-b border-border-color hover:bg-background-alt/20 transition-colors">
                  <td className="p-4 font-medium">{a.userId} {user?.userId === a.userId && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded ml-2">You</span>}</td>
                  <td className="p-4">{a.fullName}</td>
                  <td className="p-4">{a.username}</td>
                  <td className="p-4">{a.department}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(a.userId)} 
                      disabled={user?.userId === a.userId}
                      className={`text-sm ${user?.userId === a.userId ? 'text-text-muted cursor-not-allowed opacity-50' : 'text-danger hover:underline font-medium'}`}
                    >
                      Revoke Access
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">No administrators found in the system.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManager;
