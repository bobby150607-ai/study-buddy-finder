import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, BookOpen, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <header style={{
        height: '72px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-icon">SB</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800 }}>Study Buddy</h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Finder System</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Join University Network</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={16} /> Intelligent Peer Matching for University Students
        </div>

        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          maxWidth: '850px',
          margin: '0 auto 20px'
        }}>
          Find Compatible Study Partners Based on What and How You Learn
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Connect with peers taking the same subjects, sharing similar academic interests, matching your study habits (Pomodoro, silent library, or collaborative sessions), and aligned with your weekly availability.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            Find Your Study Buddy <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            Explore Demo Accounts
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginTop: '70px',
          textAlign: 'left'
        }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>50% Subject Alignment</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Automatically detects overlapping coursework like Data Structures, DBMS, and Linear Algebra so you study the exact same curriculum.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', background: '#fdf2f8', color: '#db2777', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>20% Shared Topics</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Matches specific interests including Machine Learning, competitive programming, research papers, and hackathons.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', background: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Study Groups & Chat</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Create or join subject-specific study groups, coordinate sessions, and communicate directly with connected study buddies.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', background: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Verified & Secure</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              University-domain verification, encrypted BCrypt credentials, JWT authentication, and strict privacy protection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '32px 40px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        Study Buddy Finder System • Designed for Academic Collaboration
      </footer>
    </div>
  );
};

export default LandingPage;
