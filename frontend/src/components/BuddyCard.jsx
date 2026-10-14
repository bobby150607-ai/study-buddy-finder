import React from 'react';
import { Sparkles, MessageSquare, Check, UserPlus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuddyCard = ({ buddy, onConnect, onViewBreakdown }) => {
  const navigate = useNavigate();
  const { user, profile, compatibility, connectionStatus } = buddy;
  const score = compatibility?.overallScore || 0;

  const getCompatClass = (val) => {
    if (val >= 80) return 'compat-high';
    if (val >= 60) return 'compat-mid';
    if (val >= 40) return 'compat-fair';
    return 'compat-low';
  };

  return (
    <div className="buddy-card">
      <div className="buddy-header">
        <div className="buddy-profile-info">
          <img
            src={profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`}
            alt={user?.name}
            className="buddy-avatar"
          />
          <div className="buddy-name-wrap">
            <h3>{user?.name}</h3>
            <p>{profile?.university || 'University'}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              {profile?.course || 'Student'} • Year {profile?.yearOfStudy || 1}
            </p>
          </div>
        </div>

        <div className={`compat-pill ${getCompatClass(score)}`}>
          <Sparkles size={14} /> {score}% Match
        </div>
      </div>

      {profile?.bio && <p className="buddy-bio">{profile.bio}</p>}

      {/* Common Subjects & Interests */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Subjects ({profile?.subjects?.length || 0})
        </div>
        <div className="tag-list">
          {profile?.subjects?.slice(0, 3).map((sub) => {
            const isCommon = compatibility?.commonSubjects?.includes(sub.name);
            return (
              <span key={sub.id} className={`tag-item ${isCommon ? 'highlight' : ''}`}>
                {isCommon ? '★ ' : ''}{sub.code}
              </span>
            );
          })}
          {profile?.subjects?.length > 3 && (
            <span className="tag-item">+{profile.subjects.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Preference & Times */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {profile?.preferredStudyMethod && (
          <span className="badge badge-subtle">
            Method: {profile.preferredStudyMethod}
          </span>
        )}
      </div>

      {/* Card Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          onClick={() => onViewBreakdown(buddy)}
        >
          <Info size={14} /> Score Details
        </button>

        {connectionStatus === 'ACCEPTED' ? (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={() => navigate(`/chat/${user.id}`)}
          >
            <MessageSquare size={14} /> Chat
          </button>
        ) : connectionStatus === 'PENDING_SENT' ? (
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} disabled>
            <Check size={14} /> Pending
          </button>
        ) : connectionStatus === 'PENDING_RECEIVED' ? (
          <button
            className="btn btn-success btn-sm"
            style={{ flex: 1 }}
            onClick={() => navigate('/connections')}
          >
            Accept Request
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onConnect(user.id)}
          >
            <UserPlus size={14} /> Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default BuddyCard;
