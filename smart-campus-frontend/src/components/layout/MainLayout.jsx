import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/visitor',  label: '👤 My Visit',       roles: ['VISITOR'] },
    { to: '/student',  label: '🎓 My Portal',       roles: ['STUDENT'] },
    { to: '/admin',    label: '⚙️ Admin Panel',     roles: ['ADMIN'] },
    { to: '/campus',   label: '🏛️ Campus Explorer', roles: ['ADMIN', 'STUDENT', 'VISITOR'] },
    { to: '/map',      label: '🗺️ Map & Routes',    roles: ['ADMIN', 'STUDENT', 'VISITOR'] },
  ].filter(link => !link.roles || link.roles.includes(user?.role));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* ─── NAVBAR ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(2, 8, 23, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 2rem',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(79,70,229,0.5)',
            flexShrink: 0,
          }}>🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', lineHeight: 1.1 }}>SmartCampus</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Management System</div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{
                padding: '0.5rem 1rem', borderRadius: 8,
                color: active ? 'white' : 'rgba(255,255,255,0.55)',
                fontWeight: 600, fontSize: '0.875rem',
                textDecoration: 'none',
                background: active ? 'rgba(79,70,229,0.25)' : 'transparent',
                border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; } }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 50, padding: '0.4rem 0.9rem',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' :
                  user.role === 'STUDENT' ? 'linear-gradient(135deg, #059669, #10B981)' :
                    'linear-gradient(135deg, #D97706, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {user.role === 'ADMIN' ? '⚙' : user.role === 'STUDENT' ? '🎓' : '👤'}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  {user.role === 'ADMIN' ? 'Administrator' : user.role === 'STUDENT' ? 'Student' : 'Visitor'}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                  {user.userId}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#F87171', padding: '0.5rem 1rem',
              borderRadius: 8, fontWeight: 600, fontSize: '0.8rem',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
          >
            <span>→</span> Sign Out
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, padding: '1.75rem 2rem', maxWidth: 1400, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: '1.25rem 2rem',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        background: 'rgba(2,8,23,0.7)',
        backdropFilter: 'blur(10px)',
        color: 'rgba(255,255,255,0.25)',
        fontSize: '0.78rem', fontWeight: 500,
      }}>
        © {new Date().getFullYear()} Smart Campus Management System &nbsp;·&nbsp; Powered by Spring Boot + React + Dijkstra Algorithm
      </footer>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{
          background: 'rgba(15,22,41,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          borderRadius: 12,
          fontSize: '0.875rem',
          color: 'white',
        }}
      />
    </div>
  );
};

export default MainLayout;
