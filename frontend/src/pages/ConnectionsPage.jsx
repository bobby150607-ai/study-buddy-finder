import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { 
  UserCheck, 
  Clock, 
  Check, 
  X, 
  MessageSquare, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Sparkles, 
  UserPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ConnectionsPage = () => {
  const navigate = useNavigate();
  // Tabs: 'accepted', 'incoming', 'outgoing'
  const [activeTab, setActiveTab] = useState('accepted');
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const fetchConnections = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setIsRefreshing(true);
      const [connRes, reqRes] = await Promise.all([
        api.get('/connections'),
        api.get('/connections/requests'),
      ]);

      if (connRes.data?.success) {
        setConnections(connRes.data.data || []);
      }
      if (reqRes.data?.success) {
        setPendingRequests(reqRes.data.data || { incoming: [], outgoing: [] });
      }
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      if (showLoading) setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Auto-poll connections every 3.5 seconds for real-time synchronization
  useEffect(() => {
    fetchConnections(true);
    const interval = setInterval(() => {
      fetchConnections(false);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const handleAccept = async (id, requesterName) => {
    try {
      const res = await api.put(`/connections/${id}/accept`);
      if (res.data?.success) {
        showAlert('success', `Connection accepted! You and ${requesterName || 'your classmate'} are now connected study buddies.`);
        await fetchConnections(false);
        setActiveTab('accepted');
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Error accepting request');
    }
  };

  const handleReject = async (id, requesterName) => {
    try {
      const res = await api.put(`/connections/${id}/reject`);
      if (res.data?.success) {
        showAlert('info', `Declined invitation from ${requesterName || 'student'}.`);
        await fetchConnections(false);
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Error rejecting request');
    }
  };

  const handleRemoveOrCancel = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove or cancel this connection with ${name || 'this student'}?`)) return;
    try {
      const res = await api.delete(`/connections/${id}`);
      if (res.data?.success) {
        showAlert('info', 'Invitation cancelled / connection removed.');
        await fetchConnections(false);
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Error deleting connection');
    }
  };

  // Demo helper: Accept an outgoing request on behalf of the receiver
  const handleDemoAccept = async (id, receiverName) => {
    try {
      const res = await api.post(`/connections/${id}/demo-accept`);
      if (res.data?.success) {
        showAlert('success', `Simulated acceptance! ${receiverName} accepted your invitation. Moved to Connected Study Buddies!`);
        await fetchConnections(false);
        setActiveTab('accepted');
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to simulate acceptance');
    }
  };

  // Demo helper: Simulate an incoming request sent to the current user
  const handleSimulateIncoming = async () => {
    try {
      const res = await api.post('/connections/simulate-incoming');
      if (res.data?.success) {
        const sender = res.data.data?.requesterName || 'Classmate';
        showAlert('success', `New test invitation received from ${sender}! Check your Incoming Requests.`);
        await fetchConnections(false);
        setActiveTab('incoming');
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to simulate incoming request');
    }
  };

  const incomingCount = pendingRequests.incoming?.length || 0;
  const outgoingCount = pendingRequests.outgoing?.length || 0;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title">
          <h2>Connection Management</h2>
          <p>Manage your active study buddies, review incoming requests, and track sent invitations</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchConnections(false)}
            disabled={isRefreshing}
            title="Refresh connections"
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateIncoming}
            title="Simulate a classmate sending you a study buddy invitation"
          >
            <Sparkles size={14} color="var(--primary)" /> Simulate Incoming Request
          </button>
        </div>
      </div>

      {/* Dismissible Alert Banner */}
      {alertInfo && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 500,
          background: alertInfo.type === 'success' ? 'var(--success-light)' : alertInfo.type === 'error' ? 'var(--danger-light)' : 'var(--primary-light)',
          color: alertInfo.type === 'success' ? 'var(--success)' : alertInfo.type === 'error' ? 'var(--danger)' : 'var(--primary)',
          border: `1px solid ${alertInfo.type === 'success' ? '#a7f3d0' : alertInfo.type === 'error' ? '#fecaca' : '#c7d2fe'}`
        }}>
          {alertInfo.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alertInfo.message}</span>
        </div>
      )}

      {/* 3 Explicit Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'accepted' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('accepted')}
        >
          <UserCheck size={16} /> Connected Study Buddies ({connections.length})
        </button>

        <button
          className={`btn ${activeTab === 'incoming' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none', position: 'relative' }}
          onClick={() => setActiveTab('incoming')}
        >
          <ArrowDownLeft size={16} /> Incoming Requests ({incomingCount})
          {incomingCount > 0 && (
            <span
              style={{
                background: 'var(--danger)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '999px',
                marginLeft: '6px'
              }}
            >
              Action Required
            </span>
          )}
        </button>

        <button
          className={`btn ${activeTab === 'outgoing' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('outgoing')}
        >
          <ArrowUpRight size={16} /> Sent Invitations ({outgoingCount})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Loading connections and pending invitations...
        </div>
      ) : activeTab === 'accepted' ? (
        /* TAB 1: Connected Study Buddies */
        <div>
          {connections.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <UserCheck size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3>No connected study buddies yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '440px', margin: '8px auto 20px' }}>
                When you or another classmate accepts an invitation, they will appear here with instant direct messaging access.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/find-buddies')}
                >
                  <UserPlus size={16} /> Browse Recommended Buddies
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleSimulateIncoming}
                >
                  <Sparkles size={16} /> Simulate Classmate Invitation
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {connections.map((conn) => {
                const partner = conn.otherUser;
                const profile = conn.otherProfile;
                return (
                  <div key={conn.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img
                        src={profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${partner?.id}`}
                        alt={partner?.name}
                        style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--border-color)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{partner?.name}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {profile?.university || 'University'} • {profile?.course || 'Student'}
                        </p>
                        <span className="badge badge-success" style={{ marginTop: '4px' }}>
                          ✓ Connected Partner
                        </span>
                      </div>
                    </div>

                    {profile?.bio && (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineClamp: 2 }}>
                        {profile.bio}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => navigate(`/chat/${partner?.id}`)}
                      >
                        <MessageSquare size={14} /> Open Chat
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveOrCancel(conn.id, partner?.name)}
                        title="Disconnect"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'incoming' ? (
        /* TAB 2: Incoming Requests */
        <div>
          {incomingCount === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <ArrowDownLeft size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3>No incoming requests at the moment</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '420px', margin: '8px auto 20px' }}>
                When classmates discover your profile and want to study together, their invitations will appear here for you to accept or decline.
              </p>
              <button
                className="btn btn-secondary"
                onClick={handleSimulateIncoming}
              >
                <Sparkles size={16} /> Simulate Classmate Invitation
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {pendingRequests.incoming.map((req) => (
                <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '2px solid var(--primary-light)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={req.requesterAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.requesterId}`}
                      alt={req.requesterName}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--primary)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{req.requesterName}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {req.requesterUniversity} • {req.requesterCourse}
                      </p>
                      <span className="badge badge-primary" style={{ marginTop: '4px' }}>
                        Wants to connect with you!
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '10px', borderRadius: '8px' }}>
                    Received study buddy request. Accepting will enable mutual profile access and direct 1-to-1 messaging.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleAccept(req.id, req.requesterName)}
                    >
                      <Check size={14} /> Accept Request
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleReject(req.id, req.requesterName)}
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB 3: Sent Invitations */
        <div>
          {outgoingCount === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <ArrowUpRight size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3>No outgoing invitations</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '420px', margin: '8px auto 20px' }}>
                You have no pending invitations. Search for classmates taking your subjects to send study buddy requests!
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/find-buddies')}
              >
                Find Study Buddies
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                background: 'var(--bg-subtle)',
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <span>
                  💡 <strong>Notice:</strong> These invitations were sent by you and are awaiting acceptance by the receiver. In a real environment, the receiver logs into their account to accept.
                </span>
                <span className="badge badge-subtle">
                  Auto-syncing every 3.5s
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {pendingRequests.outgoing.map((req) => (
                  <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img
                        src={req.receiverAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.receiverId}`}
                        alt={req.receiverName}
                        style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--border-color)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{req.receiverName}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {req.receiverUniversity} • {req.receiverCourse}
                        </p>
                        <span className="badge badge-warning" style={{ marginTop: '4px' }}>
                          Awaiting Reply from {req.receiverName}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Invitation sent on {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', flexWrap: 'wrap' }}>
                      {/* Interactive Demo Accept Button */}
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, minWidth: '160px' }}
                        onClick={() => handleDemoAccept(req.id, req.receiverName)}
                        title="Simulate this student accepting your request right now"
                      >
                        <Sparkles size={14} /> Accept as {req.receiverName} (Demo)
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveOrCancel(req.id, req.receiverName)}
                        title="Cancel this invitation"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
