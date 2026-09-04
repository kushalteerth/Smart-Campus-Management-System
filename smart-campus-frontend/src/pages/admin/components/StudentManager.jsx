import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    username: '',
    password: '',
    department: '',
    program: '',
    year: '',
    section: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.data);
    } catch (err) {
      toast.error('Failed to load students');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/students', formData);
      toast.success('Student created successfully');
      setFormData({ studentId: '', fullName: '', username: '', password: '', department: '', program: '', year: '', section: '' });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm(`Delete student ${studentId}?`)) return;
    try {
      await api.delete(`/admin/students/${studentId}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Student Management</h2>
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Student</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Student ID" className="form-input" required />
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="form-input" required />
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="form-input" required />
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password (Max 8, 1 Upper, 1 Lower, 1 Num)" 
            className="form-input" 
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,8}$" 
            title="Max 8 characters, at least 1 uppercase, 1 lowercase, 1 number"
            required 
          />
          <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="form-input" required />
          <input type="text" name="program" value={formData.program} onChange={handleChange} placeholder="Program" className="form-input" required />
          <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Sem/Year" className="form-input" required />
          <input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="Section" className="form-input" />
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Existing Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-4 font-semibold text-text-muted">ID</th>
                <th className="p-4 font-semibold text-text-muted">Name</th>
                <th className="p-4 font-semibold text-text-muted">Department</th>
                <th className="p-4 font-semibold text-text-muted">Year</th>
                <th className="p-4 font-semibold text-text-muted">Section</th>
                <th className="p-4 font-semibold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map(s => (
                <tr key={s.id} className="border-b border-border-color">
                  <td className="p-4">{s.studentId}</td>
                  <td className="p-4">{s.fullName}</td>
                  <td className="p-4">{s.department}</td>
                  <td className="p-4">{s.year}</td>
                  <td className="p-4">{s.section}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(s.studentId)} className="text-warning hover:underline">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-text-muted">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManager;
