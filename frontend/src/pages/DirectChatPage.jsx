import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { Send, ArrowLeft, Sparkles, BookOpen, Clock } from 'lucide-react';

const DirectChatPage = () => {
  const { buddyId } = useParams();
  const navigate = useNavigate();

  const [buddyProfile, setBuddyProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProfileAndChat();
    const interval = setInterval(fetchMessagesOnly, 3500); // Poll for real-time messages
    return () => clearInterval(interval);
  }, [buddyId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchProfileAndChat = async () => {
    try {
      setLoading(true);
      const [profileRes, msgRes] = await Promise.all([
        api.get(`/profiles/${buddyId}`),
        api.get(`/messages/${buddyId}`),
      ]);

      if (profileRes.data?.success) setBuddyProfile(profileRes.data.data);
      if (msgRes.data?.success) setMessages(msgRes.data.data);
    } catch (err) {
      console.error('Failed to load direct chat:', err);
      if (err.response?.status === 403) {
        alert('You must have an accepted connection to exchange direct messages.');
        navigate('/connections');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesOnly = async () => {
    try {
      const res = await api.get(`/messages/${buddyId}`);
      if (res.data?.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.warn('Silent refresh error:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || sending) return;

    try {
      setSending(true);
      const res = await api.post(`/messages/${buddyId}`, { content: newMsg.trim() });
      if (res.data?.success) {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMsg('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '60px' }}>Loading conversation...</div>;
  }

  return (
    <div className="page-wrapper" style={{ padding: '20px 32px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Buddy Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/connections')}>
            <ArrowLeft size={16} /> Connections
          </button>
          <img
            src={buddyProfile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${buddyId}`}
            alt={buddyProfile?.userName}
            style={{ width: '44px', height: '44px', borderRadius: '50%' }}
          />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{buddyProfile?.userName}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {buddyProfile?.university} • {buddyProfile?.course} (Year {buddyProfile?.yearOfStudy})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {buddyProfile?.preferredStudyMethod && (
            <span className="badge badge-subtle">
              Method: {buddyProfile.preferredStudyMethod}
            </span>
          )}
        </div>
      </div>

      {/* Messages Window */}
      <div className="chat-container" style={{ flex: 1, minHeight: 0 }}>
        <div className="chat-content">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
                <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                <p>You and <strong>{buddyProfile?.userName}</strong> are now connected!</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Send a message to compare notes or schedule your first study session.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.me;
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div className={`message-bubble ${isMe ? 'me' : 'other'}`}>
                      <div>{m.content}</div>
                      <div className="message-time">
                        {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-footer" style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={`Message ${buddyProfile?.userName || 'study buddy'}...`}
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              disabled={sending}
            />
            <button type="submit" className="btn btn-primary" disabled={sending || !newMsg.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default DirectChatPage;
