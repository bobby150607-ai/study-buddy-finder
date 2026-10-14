import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { BookOpen, Plus, Users, Search, MessageSquare, Check, LogOut, X } from 'lucide-react';

const StudyGroupsPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Modal
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subjectId: '',
    maxMembers: 10,
  });

  useEffect(() => {
    fetchSubjects();
    fetchGroups();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      if (res.data?.success) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroups = async (query = searchQuery) => {
    try {
      setLoading(true);
      const res = await api.get('/groups', {
        params: query ? { q: query } : {},
      });
      if (res.data?.success) {
        setGroups(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchGroups(e.target.value);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newGroup.name,
        description: newGroup.description,
        subjectId: newGroup.subjectId ? parseInt(newGroup.subjectId, 10) : null,
        maxMembers: parseInt(newGroup.maxMembers, 10),
      };
      const res = await api.post('/groups', payload);
      if (res.data?.success) {
        setShowModal(false);
        setNewGroup({ name: '', description: '', subjectId: '', maxMembers: 10 });
        fetchGroups();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating group');
    }
  };

  const handleJoin = async (groupId) => {
    try {
      const res = await api.post(`/groups/${groupId}/join`);
      if (res.data?.success) {
        fetchGroups();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining study group');
    }
  };

  const handleLeave = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this study group?')) return;
    try {
      const res = await api.post(`/groups/${groupId}/leave`);
      if (res.data?.success) {
        fetchGroups();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error leaving group');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title">
          <h2>Study Groups</h2>
          <p>Collaborative subject-specific study groups, exam prep teams, and project circles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Study Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search study groups by topic or name..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Study Groups Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading study groups...</div>
      ) : groups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <BookOpen size={40} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>No study groups found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Be the first to launch a study squad for your subject!
          </p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setShowModal(true)}>
            Create Study Group
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {groups.map((group) => (
            <div key={group.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge badge-primary">
                  {group.subjectCode || 'General Study'}
                </span>
                <span className="badge badge-subtle">
                  <Users size={12} /> {group.memberCount} / {group.maxMembers} Members
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {group.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Organized by <strong>{group.creatorName}</strong>
                </p>
              </div>

              {group.description && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                  {group.description}
                </p>
              )}

              {/* Progress bar of members capacity */}
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, (group.memberCount / group.maxMembers) * 100)}%`,
                    height: '100%',
                    background: group.memberCount >= group.maxMembers ? 'var(--danger)' : 'var(--primary)'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
                {group.isMember ? (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <MessageSquare size={14} /> Open Discussion
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleLeave(group.id)}
                      title="Leave Group"
                    >
                      <LogOut size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleJoin(group.id)}
                    disabled={group.memberCount >= group.maxMembers}
                  >
                    {group.memberCount >= group.maxMembers ? 'Group Full' : '+ Join Group'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create New Study Group</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS101 Algorithm Practice Squad"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={newGroup.subjectId}
                  onChange={(e) => setNewGroup({ ...newGroup, subjectId: e.target.value })}
                >
                  <option value="">General Study / Multi-disciplinary</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Members Capacity</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  className="form-input"
                  value={newGroup.maxMembers}
                  onChange={(e) => setNewGroup({ ...newGroup, maxMembers: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Schedule Details</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Describe your goals, weekly meeting times, or problem sets you plan to conquer..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Launch Study Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupsPage;
