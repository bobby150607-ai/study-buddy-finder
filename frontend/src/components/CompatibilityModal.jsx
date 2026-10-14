import React from 'react';
import { X, CheckCircle, BookOpen, Heart, Clock, Compass, Sparkles } from 'lucide-react';

const CompatibilityModal = ({ isOpen, onClose, buddy, onConnect }) => {
  if (!isOpen || !buddy) return null;

  const { user, profile, compatibility, connectionStatus } = buddy;
  const score = compatibility?.overallScore || 0;

  const getScoreColor = (val) => {
    if (val >= 80) return 'var(--success)';
    if (val >= 60) return 'var(--primary)';
    if (val >= 40) return 'var(--warning)';
    return 'var(--text-muted)';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`}
              alt={user?.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%' }}
            />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{user?.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {profile?.university} • {profile?.course} (Year {profile?.yearOfStudy})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Compatibility Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-light), #faf5ff)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          marginBottom: '24px',
          border: '1px solid #e0e7ff'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Algorithm Match Score
          </span>
          <div style={{ fontSize: '42px', fontWeight: 800, color: getScoreColor(score), margin: '4px 0' }}>
            {score}%
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
            {compatibility?.explanation || 'Calculated based on your academic overlap, shared topics, study habits, and schedules.'}
          </p>
        </div>

        {/* Breakdown Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          
          {/* 1. Common Subjects */}
          <div style={{ padding: '14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} color="var(--primary)" /> Common Subjects (50% Weight)
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--primary)' }}>
                {compatibility?.subjectsScore || 0} / 50 pts
              </strong>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${((compatibility?.subjectsScore || 0) / 50) * 100}%`, height: '100%', background: 'var(--primary)' }} />
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {compatibility?.commonSubjects?.length > 0 ? (
                compatibility.commonSubjects.map((sub, i) => (
                  <span key={i} className="badge badge-primary">{sub}</span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No exact subject overlaps registered yet.</span>
              )}
            </div>
          </div>

          {/* 2. Shared Interests */}
          <div style={{ padding: '14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} color="#ec4899" /> Shared Interests (20% Weight)
              </span>
              <strong style={{ fontSize: '13px', color: '#ec4899' }}>
                {compatibility?.interestsScore || 0} / 20 pts
              </strong>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${((compatibility?.interestsScore || 0) / 20) * 100}%`, height: '100%', background: '#ec4899' }} />
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {compatibility?.sharedInterests?.length > 0 ? (
                compatibility.sharedInterests.map((interest, i) => (
                  <span key={i} className="badge" style={{ background: '#fdf2f8', color: '#db2777' }}>{interest}</span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Different extracurricular interests.</span>
              )}
            </div>
          </div>

          {/* 3. Study Preference */}
          <div style={{ padding: '14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={16} color="var(--accent)" /> Study Preference (15% Weight)
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--accent)' }}>
                {compatibility?.preferenceScore || 0} / 15 pts
              </strong>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${((compatibility?.preferenceScore || 0) / 15) * 100}%`, height: '100%', background: 'var(--accent)' }} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Partner preference: <strong>{profile?.preferredStudyMethod || 'Not specified'}</strong>
            </p>
          </div>

          {/* 4. Availability */}
          <div style={{ padding: '14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--warning)" /> Compatible Availability (15% Weight)
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--warning)' }}>
                {compatibility?.availabilityScore || 0} / 15 pts
              </strong>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${((compatibility?.availabilityScore || 0) / 15) * 100}%`, height: '100%', background: 'var(--warning)' }} />
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {compatibility?.matchedAvailability?.length > 0 ? (
                compatibility.matchedAvailability.map((time, i) => (
                  <span key={i} className="badge badge-warning">{time}</span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Different preferred time slots.</span>
              )}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {connectionStatus === 'NONE' && (
            <button className="btn btn-primary" onClick={() => onConnect(user.id)}>
              <Sparkles size={16} /> Send Connection Request
            </button>
          )}
          {connectionStatus === 'PENDING_SENT' && (
            <button className="btn btn-secondary" disabled>
              Request Pending
            </button>
          )}
          {connectionStatus === 'ACCEPTED' && (
            <button className="btn btn-success" disabled>
              <CheckCircle size={16} /> Connected Buddies
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityModal;
