import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Send, Users, ArrowLeft, BookOpen, Clock, Shield } from 'lucide-react';

const GroupDetailsChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchGroupAndChat();
    const interval = setInterval(fetchMessagesOnly, 4000); // Polling for real-time messages
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGroupAndChat = async () => {
    try {
      setLoading(true);
      const [grpRes, memRes, msgRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/groups/${id}/members`),
        api.get(`/groups/${id}/messages`),
      ]);

      if (grpRes.data?.success) setGroup(grpRes.data.data);
      if (memRes.data?.success) setMembers(memRes.data.data);
      if (msgRes.data?.success) setMessages(msgRes.data.data);
    } catch (err) {
      console.error('Failed to load group chat:', err);
      if (err.response?.status === 403) {
        alert('You must be a joined member of this study group to access the chat.');
        navigate('/study-groups');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesOnly = async () => {
    try {
      const res = await api.get(`/groups/${id}/messages`);
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
      const res = await api.post(`/groups/${id}/messages`, { content: newMsg.trim() });
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
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '60px' }}>Loading group discussion...</div>;
  }

  return (
    <div className="page-wrapper" style={{ padding: '20px 32px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/study-groups')}>
          <ArrowLeft size={16} /> All Groups
        </button>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{group?.name}</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {group?.subjectCode ? `${group.subjectCode}: ${group.subjectName}` : 'General Study Group'} • {members.length} Members
          </span>
        </div>
      </div>

      {/* Main Chat + Members layout */}
      <div className="chat-container" style={{ flex: 1, minHeight: 0 }}>
        
        {/* Messages Stream */}
        <div className="chat-content">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
                <p>Welcome to <strong>{group?.name}</strong>!</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Be the first to say hi and coordinate study sessions.</p>
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
                    {!isMe && (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px', marginLeft: '8px' }}>
                        {m.senderName}
                      </span>
                    )}
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
              placeholder="Type your message to the study group..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              disabled={sending}
            />
            <button type="submit" className="btn btn-primary" disabled={sending || !newMsg.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Members Sidebar */}
        <div className="chat-sidebar" style={{ background: '#ffffff', overflowY: 'auto', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--primary)" /> Members ({members.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {members.map((mem) => (
              <div key={mem.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', borderRadius: '8px' }}>
                <img
                  src={mem.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${mem.userId}`}
                  alt={mem.userName}
                  style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mem.userName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {mem.course || 'Student'}
                  </div>
                </div>
                {mem.role === 'ADMIN' && (
                  <span className="badge badge-primary" style={{ fontSize: '10px' }}>Admin</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupDetailsChatPage;
