import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';
import { Link } from 'react-router-dom';
import { 
  User, 
  School, 
  BookOpen, 
  Calendar, 
  Heart, 
  Compass, 
  Clock, 
  CheckCircle, 
  Layers, 
  Save 
} from 'lucide-react';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    university: '',
    course: '',
    yearOfStudy: 1,
    bio: '',
    avatarUrl: '',
    interests: '',
    preferredStudyMethod: 'Hybrid',
    availableStudyTimes: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profiles/me');
      if (res.data?.success && res.data?.data) {
        const p = res.data.data;
        setProfile(p);
        setFormData({
          name: p.userName || user?.name || '',
          university: p.university || '',
          course: p.course || '',
          yearOfStudy: p.yearOfStudy || 1,
          bio: p.bio || '',
          avatarUrl: p.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`,
          interests: p.interests || '',
          preferredStudyMethod: p.preferredStudyMethod || 'Hybrid',
          availableStudyTimes: p.availableStudyTimes || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudyTimeToggle = (timeSlot) => {
    const current = formData.availableStudyTimes
      ? formData.availableStudyTimes.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    let updated;
    if (current.includes(timeSlot)) {
      updated = current.filter(t => t !== timeSlot);
    } else {
      updated = [...current, timeSlot];
    }
    setFormData({ ...formData, availableStudyTimes: updated.join(', ') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      setSaving(true);
      const res = await api.put('/profiles/me', {
        ...formData,
        yearOfStudy: parseInt(formData.yearOfStudy, 10),
      });
      if (res.data?.success) {
        setProfile(res.data.data);
        setSuccessMsg('Profile updated successfully!');
        refreshUser();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const studyMethods = [
    'Online / Video Call',
    'In-Person Library',
    'Hybrid',
    'Problem Solving Sessions',
    'Pomodoro Quiet Study',
  ];

  const standardTimes = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings',
  ];

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '60px' }}>
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '960px' }}>
      <div className="page-header">
        <div className="page-title">
          <h2>My Student Profile</h2>
          <p>This information powers the buddy matching algorithm to recommend ideal study partners</p>
        </div>
      </div>

      {successMsg && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #a7f3d0'
        }}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* Card: Basic Info */}
          <div className="card">
            <h3 className="card-title">Academic & Contact Information</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <img
                src={formData.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`}
                alt="Profile Avatar"
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--primary-light)' }}
              />
              <div style={{ flex: 1 }}>
                <label className="form-label">Avatar Image URL (DiceBear or Custom)</label>
                <input
                  type="text"
                  name="avatarUrl"
                  className="form-input"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://api.dicebear.com/7.x/bottts/svg?seed=MyName"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">University Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ background: 'var(--bg-subtle)', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">University / College</label>
                <input
                  type="text"
                  name="university"
                  className="form-input"
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <select
                  name="yearOfStudy"
                  className="form-select"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior)</option>
                  <option value={4}>4th Year (Senior)</option>
                  <option value={5}>Graduate / Masters</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Course / Degree Major</label>
              <input
                type="text"
                name="course"
                className="form-input"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bio & Study Objectives</label>
              <textarea
                name="bio"
                rows="3"
                className="form-textarea"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell potential study partners about what you are currently studying, projects, or goals..."
              />
            </div>
          </div>

          {/* Card: Study Preferences & Availability */}
          <div className="card">
            <h3 className="card-title">Study Habits & Scheduling</h3>

            <div className="form-group">
              <label className="form-label">
                <Heart size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: '#ec4899' }} />
                Academic Interests & Focus Areas (comma-separated)
              </label>
              <input
                type="text"
                name="interests"
                className="form-input"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Machine Learning, Web Development, Competitive Programming, Chess"
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Contributes 20% to your algorithmic buddy compatibility.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Compass size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: 'var(--accent)' }} />
                Preferred Study Method (15% Match Weight)
              </label>
              <select
                name="preferredStudyMethod"
                className="form-select"
                value={formData.preferredStudyMethod}
                onChange={handleChange}
              >
                {studyMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: 'var(--warning)' }} />
                Available Study Times (15% Match Weight)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {standardTimes.map(timeSlot => {
                  const isSelected = formData.availableStudyTimes?.includes(timeSlot);
                  return (
                    <button
                      type="button"
                      key={timeSlot}
                      onClick={() => handleStudyTimeToggle(timeSlot)}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {isSelected ? '✓ ' : '+ '}{timeSlot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: Current Subjects */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="card-title" style={{ marginBottom: '2px' }}>Enrolled Subjects</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Common subjects drive 50% of your compatibility score!
                </span>
              </div>
              <Link to="/select-subjects" className="btn btn-secondary btn-sm">
                <Layers size={14} /> Manage Subjects
              </Link>
            </div>

            <div className="tag-list">
              {profile?.subjects?.length > 0 ? (
                profile.subjects.map(s => (
                  <span key={s.id} className="badge badge-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                    <strong>{s.code}</strong>: {s.name}
                  </span>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  No subjects selected yet. Click 'Manage Subjects' to pick your courses!
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '15px' }}
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
