import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { Layers, Plus, Check, Search, BookOpen, CheckCircle, Save } from 'lucide-react';

const SubjectSelectionPage = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  // New subject modal state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubject, setNewSubject] = useState({ code: '', name: '', category: 'Computer Science', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, profileRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/profiles/me'),
      ]);

      if (subjectsRes.data?.success) {
        setAllSubjects(subjectsRes.data.data);
      }

      if (profileRes.data?.success && profileRes.data?.data?.subjects) {
        const enrolled = new Set(profileRes.data.data.subjects.map(s => s.id));
        setSelectedIds(enrolled);
      }
    } catch (err) {
      console.error('Error fetching subject catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setFeedback('');
      const res = await api.put('/profiles/me/subjects', {
        subjectIds: Array.from(selectedIds),
      });
      if (res.data?.success) {
        setFeedback('Enrolled subjects updated! Matching scores updated across the system.');
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subject selection.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/subjects', newSubject);
      if (res.data?.success && res.data?.data) {
        const created = res.data.data;
        setAllSubjects(prev => [...prev, created]);
        setSelectedIds(prev => new Set(prev).add(created.id));
        setIsAddingNew(false);
        setNewSubject({ code: '', name: '', category: 'Computer Science', description: '' });
        setFeedback(`Subject ${created.code} added and enrolled!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create subject.');
    }
  };

  const categories = ['ALL', ...Array.from(new Set(allSubjects.map(s => s.category).filter(Boolean)))];

  const filteredSubjects = allSubjects.filter(sub => {
    const matchesCat = selectedCategory === 'ALL' || sub.category === selectedCategory;
    const matchesSearch = sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (sub.description && sub.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title">
          <h2>Select Enrolled Subjects</h2>
          <p>Choose the courses you are currently taking. Overlapping subjects provide 50% of your compatibility score.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setIsAddingNew(!isAddingNew)}>
            <Plus size={16} /> Add New Subject
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : `Save Changes (${selectedIds.size} Selected)`}
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #a7f3d0'
        }}>
          <CheckCircle size={16} /> {feedback}
        </div>
      )}

      {/* Add New Subject Inline Form */}
      {isAddingNew && (
        <div className="card" style={{ marginBottom: '28px', border: '2px solid var(--primary)' }}>
          <h3 className="card-title" style={{ fontSize: '16px' }}>Propose or Add a New University Subject</h3>
          <form onSubmit={handleCreateSubject}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS450"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Distributed Computing"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={newSubject.category}
                  onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="Key topics and curriculum covered..."
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddingNew(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Subject to Catalog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by code (e.g. CS101) or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Catalog Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading subject catalog...</div>
      ) : filteredSubjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No subjects found matching your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredSubjects.map((sub) => {
            const isEnrolled = selectedIds.has(sub.id);
            return (
              <div
                key={sub.id}
                className="card"
                onClick={() => toggleSubject(sub.id)}
                style={{
                  cursor: 'pointer',
                  border: isEnrolled ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isEnrolled ? 'var(--primary-light)' : '#ffffff',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-primary" style={{ fontWeight: 700 }}>
                    {sub.code}
                  </span>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isEnrolled ? 'none' : '2px solid #cbd5e1',
                    background: isEnrolled ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'var(--transition)'
                  }}>
                    {isEnrolled && <Check size={16} />}
                  </div>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {sub.name}
                </h4>

                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {sub.category}
                </span>

                {sub.description && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {sub.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectSelectionPage;
