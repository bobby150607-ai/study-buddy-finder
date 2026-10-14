
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Bell, LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Load saved settings instead of always defaulting to true
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('connectionRequestAlerts');
    return saved === null ? true : saved === 'true';
  });

  const [emailAlerts, setEmailAlerts] = useState(() => {
    const saved = localStorage.getItem('studyGroupActivityAlerts');
    return saved === null ? true : saved === 'true';
  });

  // Persist settings whenever a checkbox changes
  useEffect(() => {
    localStorage.setItem(
      'connectionRequestAlerts',
      String(notificationsEnabled)
    );
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      'studyGroupActivityAlerts',
      String(emailAlerts)
    );
  }, [emailAlerts]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div className="page-title">
          <h2>Account & Application Settings</h2>
          <p>
            Manage security, preferences, and notifications for Study Buddy Finder
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div className="card">
          <h3 className="card-title" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Shield size={18} color="var(--primary)" />
            Security & Credentials
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            fontSize: '14px'
          }}>
            <div>
              <strong>Authentication Standard</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256
              </p>
              <span className="badge badge-success">
                Active & Verified
              </span>
            </div>

            <div>
              <strong>Password Encryption</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Salted multi-round BCrypt hashing
              </p>
              <span className="badge badge-primary">Secured</span>
            </div>

            <div>
              <strong>Role & Permissions</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Standard University Student account (
                {user?.role || 'ROLE_STUDENT'})
              </p>
              <span className="badge badge-subtle">Authorized</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Bell size={18} color="var(--warning)" />
            Notifications
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div>
                <strong style={{ fontSize: '14px' }}>
                  Connection Request Alerts
                </strong>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  Receive instant alerts when another student wants to
                  connect with you
                </p>
              </div>

              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) =>
                  setNotificationsEnabled(e.target.checked)
                }
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--primary)'
                }}
              />
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div>
                <strong style={{ fontSize: '14px' }}>
                  Study Group Activity
                </strong>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  Notify me when classmates post new discussion messages
                  or schedules
                </p>
              </div>

              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--primary)'
                }}
              />
            </label>
          </div>
        </div>

        <div className="card" style={{
          border: '1px solid #fee2e2',
          background: '#fffafa'
        }}>
          <h3 className="card-title" style={{
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={18} />
            Session & Account Actions
          </h3>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '16px'
          }}>
            Signing out will invalidate your local session token.
            You can sign back in anytime.
          </p>

          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={16} />
            Log Out of Study Buddy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
