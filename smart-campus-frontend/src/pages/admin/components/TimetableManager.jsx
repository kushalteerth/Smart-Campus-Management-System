import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const TimetableManager = () => {
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [students, setStudents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    dayOfWeek: 'MONDAY',
    startTime: '',
    endTime: '',
    instructor: '',
    locationId: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (filterStudentId) {
      fetchTimetable(filterStudentId);
    } else {
      setTimetableEntries([]);
    }
  }, [filterStudentId]);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data.data || []);
    } catch {
      console.error('Failed to load students');
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

  const fetchTimetable = async (studentId) => {
    try {
      const res = await api.get(`/timetable/student/${studentId}`);
      setTimetableEntries(res.data.data || []);
    } catch {
      setTimetableEntries([]);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime) {
      toast.warning('Please set both start and end times');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      toast.warning('Start time must be before end time');
      return;
    }
    setLoading(true);
    try {
      await api.post('/timetable', formData);
      toast.success('Timetable entry added successfully');
      setFormData({ studentId: filterStudentId, subject: '', dayOfWeek: 'MONDAY', startTime: '', endTime: '', instructor: '', locationId: '' });
      setShowForm(false);
      if (filterStudentId) fetchTimetable(filterStudentId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add timetable entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this timetable entry?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      toast.success('Timetable entry removed');
      if (filterStudentId) fetchTimetable(filterStudentId);
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  const selectedStudent = students.find(s => s.studentId === filterStudentId);

  // Group by day for visual display
  const byDay = DAYS.reduce((acc, day) => {
    const entries = timetableEntries.filter(e => e.dayOfWeek === day);
    if (entries.length > 0) acc[day] = entries;
    return acc;
  }, {});

  const dayColors = {
    MONDAY: 'border-l-indigo-500',
    TUESDAY: 'border-l-violet-500',
    WEDNESDAY: 'border-l-blue-500',
    THURSDAY: 'border-l-cyan-500',
    FRIDAY: 'border-l-emerald-500',
    SATURDAY: 'border-l-amber-500',
    SUNDAY: 'border-l-rose-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Timetable Management</h2>
        <button
          onClick={() => { setShowForm(!showForm); if (!showForm && filterStudentId) setFormData(f => ({ ...f, studentId: filterStudentId })); }}
          className="btn-primary flex items-center gap-2 text-sm"
          disabled={!filterStudentId}
          title={!filterStudentId ? 'Select a student first' : ''}
        >
          {showForm ? '✕ Cancel' : '+ Add Entry'}
        </button>
      </div>

      {/* Student Selector */}
      <div className="card p-5 mb-6">
        <label className="text-sm font-semibold text-text-muted block mb-2">Select Student to View / Edit Timetable</label>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filterStudentId}
            onChange={e => { setFilterStudentId(e.target.value); setShowForm(false); }}
            className="form-input max-w-xs"
          >
            <option value="">-- Select a student --</option>
            {students.map(s => (
              <option key={s.studentId} value={s.studentId}>{s.fullName} ({s.studentId})</option>
            ))}
          </select>
          {selectedStudent && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">🎓</span>
              <span><strong>{selectedStudent.fullName}</strong> · {selectedStudent.program} · Year {selectedStudent.year}</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showForm && filterStudentId && (
        <div className="card p-6 mb-6 border-l-4 border-primary">
          <h3 className="text-xl font-semibold mb-4">Add Timetable Entry</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Data Structures"
                className="form-input mt-1"
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="e.g. Dr. Alan Turing"
                className="form-input mt-1"
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Day</label>
              <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="form-input mt-1">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Classroom / Location</label>
              <select name="locationId" value={formData.locationId} onChange={handleChange} className="form-input mt-1">
                <option value="">-- Select location (optional) --</option>
                {locations.map(loc => (
                  <option key={loc.locationId} value={loc.locationId}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="form-input mt-1" required />
            </div>
            <div className="form-group mb-0">
              <label className="text-sm font-medium text-text-muted">End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="form-input mt-1" required />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
                {loading ? 'Adding...' : '📅 Add to Timetable'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timetable Display */}
      {filterStudentId ? (
        timetableEntries.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(byDay).map(([day, entries]) => (
              <div key={day} className={`card p-0 border-l-4 ${dayColors[day]} overflow-hidden`}>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-border-color flex items-center gap-2">
                  <span className="font-bold text-sm uppercase tracking-wide">{day}</span>
                  <span className="text-xs text-text-muted">({entries.length} class{entries.length > 1 ? 'es' : ''})</span>
                </div>
                <div className="divide-y divide-border-color">
                  {entries.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(entry => (
                    <div key={entry.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm">{entry.subject}</span>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>🕒 {entry.startTime} – {entry.endTime}</span>
                          {entry.instructor && <span>👨‍🏫 {entry.instructor}</span>}
                          {entry.locationName && <span>📍 {entry.locationName}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs text-red-500 hover:underline font-semibold shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border-color text-text-muted">
            <div className="text-4xl mb-3">📅</div>
            <div className="font-semibold">No timetable entries for this student</div>
            <p className="text-sm mt-1">Click "+ Add Entry" to get started</p>
          </div>
        )
      ) : (
        <div className="text-center p-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border-color text-text-muted">
          <div className="text-4xl mb-3">🎓</div>
          <div className="font-semibold">Select a student above</div>
          <p className="text-sm mt-1">Choose a student to view and manage their class schedule</p>
        </div>
      )}
    </div>
  );
};

export default TimetableManager;
