import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import campusHero from '../../assets/campus_hero.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const doLogin = async (u, p, label = '') => {
    if (label) setDemoLoading(label); else setLoading(true);
    try {
      const user = await login(u, p);
      if (user) {
        toast.success(`Welcome! Signed in as ${user.role}.`);
        if (user.role === 'ADMIN') navigate('/admin');
        else if (user.role === 'STUDENT') navigate('/student');
        else navigate('/map');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check server.');
    } finally {
      setLoading(false);
      setDemoLoading('');
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); doLogin(username, password); };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#020817', fontFamily: "'Inter', sans-serif",
    }}>
      {/* Left: Campus Photo */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem',
        minHeight: '100vh',
      }}>
        <img src={campusHero} alt="Campus" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 30%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,8,23,0.95) 0%, rgba(2,8,23,0.3) 100%)',
        }} />

        {/* Logo top-left */}
        <Link to="/" style={{
          position: 'absolute', top: '2rem', left: '2.5rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', zIndex: 2,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(79,70,229,0.5)',
          }}>🎓</div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>SmartCampus</span>
        </Link>

        {/* Bottom text overlay */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(79,70,229,0.25)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 50, padding: '0.3rem 0.9rem',
            color: '#A5B4FC', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#818CF8' }} />
            Secure Campus Portal
          </div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: '2.25rem', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Your Gateway to<br />
            <span style={{ background: 'linear-gradient(90deg, #818CF8, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Smart Campus Life
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', maxWidth: 380, lineHeight: 1.6 }}>
            Access the navigation system, timetable, facilities, and campus information — all from one secure platform.
          </p>

          {/* Testimonials / Trust Badges */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {['🔒 256-bit SSL', '🏛️ NAAC A++', '📱 Mobile Friendly'].map(badge => (
              <span key={badge} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, padding: '0.35rem 0.75rem',
                color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 600,
              }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div style={{
        width: 480, flexShrink: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '3rem 3.5rem',
        background: '#0A1020',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            Sign In
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Welcome back! Enter your credentials to continue.
          </p>
        </div>

        {/* Demo Quick Access */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.75rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            ⚡ Quick Demo Access
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { label: 'admin', icon: '⚙️', color: '#6366F1', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', name: 'Admin' },
              { label: 'student', icon: '🎓', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', name: 'Student' },
            ].map(d => (
              <button
                key={d.label}
                onClick={() => doLogin(d.label, 'password', d.label)}
                disabled={!!demoLoading || loading}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  background: d.bg, border: `1px solid ${d.border}`,
                  color: d.color, borderRadius: 8, padding: '0.6rem',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                  opacity: demoLoading && demoLoading !== d.label ? 0.5 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {demoLoading === d.label ? <span style={{ animation: 'spin 0.6s linear infinite', display: 'inline-block' }}>⏳</span> : d.icon}
                {' '}{d.name} Demo
              </button>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginTop: '0.6rem', textAlign: 'center' }}>
            Credentials: admin/password or student/password
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', fontWeight: 600 }}>OR SIGN IN MANUALLY</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>👤</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                autoComplete="username"
                style={{
                  width: '100%', padding: '0.9rem 1rem 0.9rem 2.75rem',
                  background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: 'white', fontSize: '0.95rem',
                  outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>🔑</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '0.9rem 1rem 0.9rem 2.75rem',
                  background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: 'white', fontSize: '0.95rem',
                  outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!demoLoading}
            style={{
              width: '100%', padding: '1rem',
              background: loading ? 'rgba(79,70,229,0.6)' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: 'white', border: 'none', borderRadius: 10,
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s', boxShadow: '0 6px 25px rgba(79,70,229,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 35px rgba(79,70,229,0.6)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(79,70,229,0.45)'; }}
          >
            {loading ? <><span style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }}>⏳</span> Signing in...</> : <><span>🚀</span> Sign In</>}
          </button>
        </form>

        {/* Visitor / Back links */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/visitor-login" style={{
            color: '#818CF8', fontSize: '0.875rem', fontWeight: 600,
            textDecoration: 'none', display: 'block', marginBottom: '0.5rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#A5B4FC'}
            onMouseLeave={e => e.target.style.color = '#818CF8'}
          >
            🗺️ Enter as Campus Visitor →
          </Link>
          <Link to="/" style={{
            color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}
          >
            ← Back to Home
          </Link>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Login;
