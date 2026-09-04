// Smart Campus Home Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import campusHero from '../assets/campus_hero.jpg';
import campusLibrary from '../assets/campus_library.jpg';

const STATS = [
  { icon: '🏛️', value: '50+', label: 'Buildings & Blocks', color: '#4F46E5' },
  { icon: '👨‍🎓', value: '12,000+', label: 'Students Enrolled', color: '#10B981' },
  { icon: '📚', value: '180+', label: 'Academic Programs', color: '#F59E0B' },
  { icon: '🏆', value: 'A++', label: 'NAAC Accreditation', color: '#EF4444' },
];

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Smart Route Planner',
    desc: 'Find the shortest path between any two campus locations using our AI-powered Dijkstra navigation engine.',
    color: 'from-indigo-500 to-purple-600',
    badge: 'Dijkstra AI'
  },
  {
    icon: '🎓',
    title: 'Student Portal',
    desc: 'View your class timetable, academic schedule, department info, and classroom locations all in one place.',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Personalized'
  },
  {
    icon: '⚙️',
    title: 'Admin Control Center',
    desc: 'Manage students, faculty, locations, routes, facilities, departments and visitor access from a single dashboard.',
    color: 'from-orange-500 to-rose-600',
    badge: 'Full CRUD'
  },
  {
    icon: '👤',
    title: 'Visitor Access',
    desc: 'Guests can enter campus seamlessly — get directions, explore facilities, and submit feedback after your visit.',
    color: 'from-blue-500 to-cyan-600',
    badge: 'Open Access'
  },
];

const QUICK_LINKS = [
  { to: '/login', icon: '🔐', label: 'Admin Login', sub: 'Manage campus operations', gradient: 'linear-gradient(135deg, #1e1b4b, #4338CA)', glow: '#4F46E5' },
  { to: '/login', icon: '🎓', label: 'Student Login', sub: 'My portal & timetable', gradient: 'linear-gradient(135deg, #064e3b, #059669)', glow: '#10B981' },
  { to: '/visitor-login', icon: '🗺️', label: 'Campus Explorer', sub: 'Navigate as a visitor', gradient: 'linear-gradient(135deg, #7c2d12, #EA580C)', glow: '#F59E0B' },
];

const CAMPUS_GALLERY = [
  { label: 'Academic Blocks', count: '12', icon: '🏛️' },
  { label: 'Research Labs', count: '38', icon: '🔬' },
  { label: 'Sports Facilities', count: '15', icon: '⚽' },
  { label: 'Cafeterias', count: '5', icon: '☕' },
];

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  const isOpen = hour >= 9 && hour < 17;

  return (
    <div style={{ background: '#020817', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ─── Top Status Bar ─── */}
      <div style={{
        background: isOpen ? 'linear-gradient(90deg, #064e3b, #065f46)' : 'linear-gradient(90deg, #1e1b4b, #312e81)',
        padding: '0.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.85)',
      }}>
        <span>{isOpen ? '✅ Campus Open' : '🔴 Campus Closed'} &nbsp;|&nbsp; Hours: Mon – Sat, 9:00 AM – 5:00 PM</span>
        <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          🕐 {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* ─── NAVBAR ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(2, 8, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(79,70,229,0.5)'
          }}>🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', lineHeight: 1 }}>SmartCampus</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Management System</div>
          </div>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {['About', 'Academics', 'Facilities', 'Contact'].map(item => (
            <button key={item} style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
              padding: '0.5rem 0.9rem', borderRadius: 8, fontSize: '0.875rem',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'Inter', sans-serif"
            }}
              onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.background = 'transparent'; }}
            >{item}</button>
          ))}
          <Link to="/login" style={{
            marginLeft: '0.75rem',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: 'white', padding: '0.55rem 1.4rem',
            borderRadius: 50, fontWeight: 700, fontSize: '0.875rem',
            boxShadow: '0 4px 15px rgba(79,70,229,0.45)',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            transition: 'all 0.25s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(79,70,229,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(79,70,229,0.45)'; }}
          >
            Login <span>→</span>
          </Link>
        </nav>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section style={{ position: 'relative', height: '93vh', minHeight: 600, overflow: 'hidden' }}>
        {/* Hero background image */}
        <img
          src={campusHero}
          alt="Smart Campus"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 30%',
            filter: 'brightness(0.38) saturate(1.1)',
          }}
        />

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(2,8,23,0.2) 0%, rgba(2,8,23,0.0) 40%, rgba(2,8,23,0.85) 85%, #020817 100%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,70,229,0.08) 0%, transparent 70%)'
        }} />

        {/* Floating Particle Orbs */}
        {[
          { size: 500, top: '10%', left: '-10%', color: 'rgba(79,70,229,0.08)', delay: '0s' },
          { size: 400, top: '60%', right: '-10%', color: 'rgba(16,185,129,0.06)', delay: '2s' },
          { size: 300, top: '20%', right: '15%', color: 'rgba(245,158,11,0.05)', delay: '1s' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            top: orb.top, left: orb.left, right: orb.right,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: orb.delay,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Hero Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '2rem', textAlign: 'center',
          maxWidth: 900, margin: '0 auto',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(79,70,229,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: 50, padding: '0.45rem 1.25rem',
            color: '#A5B4FC', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '1.75rem',
            animation: 'fadeInUp 0.8s ease forwards',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', boxShadow: '0 0 6px #818CF8' }} />
            NAAC A++ Accredited Institution
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'white',
            marginBottom: '1rem',
            animation: 'fadeInUp 0.8s ease 0.1s both',
          }}>
            Welcome to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818CF8, #34D399, #FBBF24)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 5s ease infinite',
            }}>
              Smart Campus
            </span>
          </h1>

          {/* Sub-heading */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 680, lineHeight: 1.7,
            marginBottom: '2.5rem',
            animation: 'fadeInUp 0.8s ease 0.2s both',
            fontWeight: 400,
          }}>
            Empowering students, faculty, and visitors with intelligent campus navigation,
            real-time information, and seamless digital services.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
            animation: 'fadeInUp 0.8s ease 0.3s both',
          }}>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: 'white', padding: '1rem 2.25rem',
              borderRadius: 50, fontWeight: 700, fontSize: '1rem',
              boxShadow: '0 6px 30px rgba(79,70,229,0.55)',
              transition: 'all 0.3s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,70,229,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(79,70,229,0.55)'; }}
            >
              <span>🚀</span> Get Started
            </Link>
            <Link to="/visitor-login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: 'white', padding: '1rem 2.25rem',
              borderRadius: 50, fontWeight: 600, fontSize: '1rem',
              transition: 'all 0.3s', textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span>🗺️</span> Explore Campus
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', fontWeight: 600,
          animation: 'float 2s ease-in-out infinite',
        }}>
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section style={{
        background: 'rgba(15, 22, 41, 0.95)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '2.5rem',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '1.5rem 1rem',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{
                fontSize: '2rem', fontWeight: 900, color: stat.color,
                letterSpacing: '-0.03em', lineHeight: 1,
              }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.35rem', letterSpacing: '0.03em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CAMPUS PHOTO SECTION ─── */}
      <section style={{ padding: '5rem 2.5rem', background: '#020817' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(52,211,153,0.25)',
              color: '#34D399', borderRadius: 50, padding: '0.35rem 1rem',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '1rem',
            }}>Our Beautiful Campus</span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900,
              color: 'white', letterSpacing: '-0.03em',
            }}>
              World-Class Facilities,<br />
              <span style={{ color: '#818CF8' }}>Enriching Environment</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Large main photo */}
            <div style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              gridRow: 'span 2', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <img src={campusHero} alt="Main Campus" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 450 }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(2,8,23,0.9) 0%, transparent 50%)',
              }} />
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '1.5rem',
                color: 'white',
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>Main Academic Campus</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>Award-winning architecture • Est. 1985</div>
              </div>
            </div>

            {/* Right smaller photo */}
            <div style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <img src={campusLibrary} alt="Campus Library" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 200 }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(2,8,23,0.8) 0%, transparent 50%)',
              }} />
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'white' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>Central Library & Knowledge Hub</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>50,000+ volumes • 24/7 Digital Access</div>
              </div>
            </div>

            {/* Campus fact grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {CAMPUS_GALLERY.map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: '1.25rem', textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{item.count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section style={{ padding: '5rem 2.5rem', background: 'rgba(10, 17, 35, 0.8)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              color: '#818CF8', borderRadius: 50, padding: '0.35rem 1rem',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '1rem',
            }}>Platform Features</span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900,
              color: 'white', letterSpacing: '-0.03em',
            }}>
              Everything You Need,<br />
              <span style={{ color: '#34D399' }}>All In One Place</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {FEATURES.map((feat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24, padding: '2rem',
                transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 120, height: 120,
                  background: `linear-gradient(135deg, ${feat.color.includes('indigo') ? 'rgba(79,70,229,0.12)' : feat.color.includes('emerald') ? 'rgba(16,185,129,0.12)' : feat.color.includes('orange') ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)'}, transparent)`,
                  borderRadius: '0 24px 0 120px',
                }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(135deg, ${feat.color.split(' ')[0].replace('from-', '')}, transparent)`,
                    backgroundImage: `linear-gradient(135deg, ${feat.color.includes('indigo') ? '#4F46E5, #7C3AED' : feat.color.includes('emerald') ? '#10B981, #0D9488' : feat.color.includes('orange') ? '#F59E0B, #EF4444' : '#3B82F6, #06B6D4'})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  }}>{feat.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{feat.title}</h3>
                      <span style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.65rem', fontWeight: 700,
                        padding: '0.15rem 0.5rem', borderRadius: 4,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>{feat.badge}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.6 }}>{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK ACCESS PORTAL CARDS ─── */}
      <section style={{ padding: '5rem 2.5rem', background: '#020817' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900,
              color: 'white', letterSpacing: '-0.03em',
            }}>
              Choose Your Portal
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Tailored access for every member of our campus community
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {QUICK_LINKS.map((item, i) => (
              <Link key={i} to={item.to} style={{
                textDecoration: 'none',
                background: item.gradient,
                borderRadius: 24, padding: '2.5rem 2rem', textAlign: 'center',
                border: `1px solid rgba(255,255,255,0.1)`,
                transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
                display: 'block', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 25px 60px rgba(0,0,0,0.6), 0 0 40px ${item.glow}33`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>{item.label}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{item.sub}</p>
                <div style={{
                  marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600,
                }}>
                  Enter Portal <span style={{ fontSize: '1.1rem' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: '#010510',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '3rem 2.5rem 2rem',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                }}>🎓</div>
                <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>SmartCampus</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
                A next-generation campus management system designed to simplify and enhance the university experience for everyone.
              </p>
            </div>
            {[
              { title: 'Portals', links: ['Admin Panel', 'Student Portal', 'Visitor Access', 'Campus Map'] },
              { title: 'Campus', links: ['Departments', 'Facilities', 'Library', 'Sports Complex'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'Emergency', 'Feedback'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>{col.title}</h4>
                {col.links.map(link => (
                  <div key={link} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginBottom: '0.6rem', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
                  >{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} Smart Campus Management System. Built with ❤️ for academic excellence.
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
              Powered by Spring Boot · React · Dijkstra Algorithm
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
