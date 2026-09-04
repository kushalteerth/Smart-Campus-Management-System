import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const dayColors = {
  MONDAY: 'from-indigo-500/10 border-indigo-400',
  TUESDAY: 'from-violet-500/10 border-violet-400',
  WEDNESDAY: 'from-blue-500/10 border-blue-400',
  THURSDAY: 'from-cyan-500/10 border-cyan-400',
  FRIDAY: 'from-emerald-500/10 border-emerald-400',
  SATURDAY: 'from-amber-500/10 border-amber-400',
  SUNDAY: 'from-rose-500/10 border-rose-400',
};

const dayBadge = {
  MONDAY: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  TUESDAY: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  WEDNESDAY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  THURSDAY: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  FRIDAY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  SATURDAY: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  SUNDAY: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'list'
  const [loadingTimetable, setLoadingTimetable] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchStudentDetails();
      fetchTimetable();
    }
  }, [user]);

  const fetchStudentDetails = async () => {
    try {
      const studentId = user.userId.startsWith('S_') ? user.userId.substring(2) : user.userId;
      const res = await api.get(`/students/${studentId}`);
      setStudentDetails(res.data.data);
    } catch (err) {
      console.error('Failed to load student details', err);
    }
  };

  const fetchTimetable = async () => {
    setLoadingTimetable(true);
    try {
      const res = await api.get(`/timetable/student/${user.userId}`);
      setTimetable(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load timetable');
    } finally {
      setLoadingTimetable(false);
    }
  };

  // Group timetable by day
  const byDay = DAYS_ORDER.reduce((acc, day) => {
    const entries = timetable.filter(e => e.dayOfWeek === day);
    if (entries.length) acc[day] = entries.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  const totalClasses = timetable.length;
  const activeDays = Object.keys(byDay).length;

  // Find next upcoming class
  const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const todayClasses = byDay[today] || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Student Portal</h1>
          <p className="text-text-muted text-sm mt-1">Welcome back{studentDetails ? `, ${studentDetails.fullName.split(' ')[0]}` : ''}! 👋</p>
        </div>
        <div className="flex gap-2">
          <Link to="/campus" className="btn-primary text-sm flex items-center gap-1.5" style={{ textDecoration: 'none', background: 'rgba(79,70,229,0.15)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.3)' }}>
            🏛️ Campus Explorer
          </Link>
          <Link to="/map" className="btn-primary text-sm flex items-center gap-1.5" style={{ textDecoration: 'none' }}>
            🗺️ Route Finder
          </Link>
        </div>
      </div>

      {/* Student Profile Card */}
      {studentDetails && (
        <div className="card overflow-hidden">
          <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #4F46E5, #10B981)' }} />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                {studentDetails.fullName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold">{studentDetails.fullName}</h2>
                <p className="text-text-muted text-sm">{studentDetails.program}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border-color">
              {[
                { label: 'Student ID', value: studentDetails.studentId, icon: '🆔' },
                { label: 'Department', value: studentDetails.department || 'N/A', icon: '🏢' },
                { label: 'Year / Sem', value: `Year ${studentDetails.year}`, icon: '📅' },
                { label: 'Section', value: studentDetails.section || 'N/A', icon: '👥' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-text-muted flex items-center gap-1">{item.icon} {item.label}</p>
                  <p className="font-semibold text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '📚', label: 'Total Classes', value: totalClasses, color: 'text-primary' },
          { icon: '📅', label: 'Active Days', value: activeDays, color: 'text-secondary' },
          { icon: '🏫', label: "Today's Classes", value: todayClasses.length, color: 'text-amber-500' },
          { icon: '🎯', label: 'Subjects', value: new Set(timetable.map(t => t.subject)).size, color: 'text-violet-500' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xs text-text-muted">{stat.label}</p>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Classes Banner */}
      {todayClasses.length > 0 && (
        <div className="card p-4 border-l-4 border-amber-400 bg-amber-50/30 dark:bg-amber-900/5">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            Today's Schedule — {today}
          </h3>
          <div className="flex flex-wrap gap-3">
            {todayClasses.map(cls => (
              <div key={cls.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-border-color text-sm shadow-sm">
                <span className="text-xs text-amber-600 font-bold font-mono">{cls.startTime}</span>
                <span className="font-semibold">{cls.subject}</span>
                {cls.locationName && <span className="text-xs text-text-muted">📍 {cls.locationName}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">📅 Weekly Timetable</h2>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'week' ? 'bg-white dark:bg-slate-700 shadow' : 'text-text-muted'}`}
            >
              🗓 Week View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow' : 'text-text-muted'}`}
            >
              📋 List View
            </button>
          </div>
        </div>

        {loadingTimetable ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : timetable.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-border-color text-text-muted">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="font-bold text-xl mb-2">No Classes Scheduled</h3>
            <p>Your timetable is empty. Ask your administrator to add classes.</p>
          </div>
        ) : viewMode === 'week' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(byDay).map(([day, classes]) => (
              <div key={day} className={`card overflow-hidden border-t-4 ${dayColors[day]?.split(' ')[1] || 'border-primary'}`}>
                <div className={`px-4 py-3 flex items-center justify-between bg-gradient-to-r ${dayColors[day]?.split(' ')[0] || ''} to-transparent`}>
                  <h3 className="font-bold text-sm">{day}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dayBadge[day]}`}>
                    {classes.length} class{classes.length > 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="divide-y divide-border-color">
                  {classes.map(cls => (
                    <div key={cls.id} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{cls.subject}</p>
                        <span className="text-xs text-primary font-mono whitespace-nowrap">{cls.startTime}</span>
                      </div>
                      <div className="text-xs text-text-muted mt-1 space-y-0.5">
                        {cls.instructor && <div>👨‍🏫 {cls.instructor}</div>}
                        {cls.locationName && <div>📍 {cls.locationName}</div>}
                        <div>🕒 {cls.startTime} – {cls.endTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-border-color">
                    <th className="p-4 text-sm font-semibold text-text-muted">Day</th>
                    <th className="p-4 text-sm font-semibold text-text-muted">Time</th>
                    <th className="p-4 text-sm font-semibold text-text-muted">Subject</th>
                    <th className="p-4 text-sm font-semibold text-text-muted">Instructor</th>
                    <th className="p-4 text-sm font-semibold text-text-muted">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS_ORDER.flatMap(day =>
                    (byDay[day] || []).map(cls => (
                      <tr key={cls.id} className="border-b border-border-color hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dayBadge[cls.dayOfWeek] || ''}`}>{cls.dayOfWeek}</span>
                        </td>
                        <td className="p-4 text-sm font-mono">{cls.startTime} – {cls.endTime}</td>
                        <td className="p-4 font-semibold text-sm">{cls.subject}</td>
                        <td className="p-4 text-sm text-text-muted">{cls.instructor || '—'}</td>
                        <td className="p-4 text-sm text-text-muted">{cls.locationName || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
