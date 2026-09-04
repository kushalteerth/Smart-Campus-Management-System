import React, { useState } from 'react';
import AdminManager from './components/AdminManager';
import StudentManager from './components/StudentManager';
import LocationManager from './components/LocationManager';
import DepartmentManager from './components/DepartmentManager';
import FacilityManager from './components/FacilityManager';
import RouteManager from './components/RouteManager';
import OperationsManager from './components/OperationsManager';
import TimetableManager from './components/TimetableManager';
import VisitorStats from './components/VisitorStats';

const NAV_ITEMS = [
  { key: 'admin',      label: 'Admin Management',      icon: '👤', group: 'Users' },
  { key: 'student',    label: 'Student Management',    icon: '🎓', group: 'Users' },
  { key: 'location',   label: 'Locations',             icon: '📍', group: 'Campus' },
  { key: 'department', label: 'Departments',           icon: '🏢', group: 'Campus' },
  { key: 'facilities', label: 'Facilities',            icon: '🛠️', group: 'Campus' },
  { key: 'routes',     label: 'Route Network',         icon: '🔗', group: 'Campus' },
  { key: 'operations', label: 'Operations',            icon: '⚙️', group: 'Campus' },
  { key: 'timetable',  label: 'Timetable',             icon: '📅', group: 'Academic' },
  { key: 'visitors',   label: 'Visitor Stats',         icon: '📊', group: 'Analytics' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('admin');

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':      return <AdminManager />;
      case 'student':    return <StudentManager />;
      case 'location':   return <LocationManager />;
      case 'department': return <DepartmentManager />;
      case 'facilities': return <FacilityManager />;
      case 'routes':     return <RouteManager />;
      case 'operations': return <OperationsManager />;
      case 'timetable':  return <TimetableManager />;
      case 'visitors':   return <VisitorStats />;
      default:           return <AdminManager />;
    }
  };

  const groups = [...new Set(NAV_ITEMS.map(n => n.group))];

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-60 shrink-0 flex flex-col gap-1">
        <h2 className="text-xl font-bold mb-3 px-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm">⚙</span>
          Admin Portal
        </h2>

        {groups.map(group => (
          <div key={group} className="mb-2">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted/60 mb-0.5">
              {group}
            </div>
            {NAV_ITEMS.filter(n => n.group === group).map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2.5 text-sm font-medium ${
                  activeTab === item.key
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted hover:text-text-color'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border-color p-6 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
