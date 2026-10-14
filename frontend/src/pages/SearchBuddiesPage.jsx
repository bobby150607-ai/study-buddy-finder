import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import BuddyCard from '../components/BuddyCard';
import CompatibilityModal from '../components/CompatibilityModal';
import { Search, Filter, Sparkles, RefreshCw, X } from 'lucide-react';

const SearchBuddiesPage = () => {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    q: '',
    subject: '',
    university: '',
    course: '',
    year: '',
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
    searchBuddies();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      if (res.data?.success) {
        setAvailableSubjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const searchBuddies = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const params = {};
      if (appliedFilters.q) params.q = appliedFilters.q;
      if (appliedFilters.subject) params.subject = appliedFilters.subject;
      if (appliedFilters.university) params.university = appliedFilters.university;
      if (appliedFilters.course) params.course = appliedFilters.course;
      if (appliedFilters.year) params.year = appliedFilters.year;

      const res = await api.get('/buddies/search', { params });
      if (res.data?.success) {
        setBuddies(res.data.data);
      }
    } catch (err) {
      console.error('Failed to search buddies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    searchBuddies(updated);
  };

  const clearFilters = () => {
    const cleared = { q: '', subject: '', university: '', course: '', year: '' };
    setFilters(cleared);
    searchBuddies(cleared);
  };

  const handleConnect = async (targetUserId) => {
    try {
      const res = await api.post(`/connections/${targetUserId}`);
      if (res.data?.success) {
        alert('Connection request sent!');
        searchBuddies();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send connection request');
    }
  };

  const handleViewBreakdown = (buddy) => {
    setSelectedBuddy(buddy);
    setIsModalOpen(true);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title">
          <h2>Find Study Buddies</h2>
          <p>Search and filter university peers with automated 4-factor compatibility scoring</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr', gap: '14px', alignItems: 'flex-end' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Keyword or Topic</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px' }}
                placeholder="Name, bio, machine learning..."
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
            >
              <option value="">All Subjects</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.code}: {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">University</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stanford"
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Year of Study</label>
            <select
              className="form-select"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">Any Year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
              <option value="5">Grad/Masters</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', height: '40px' }}
              onClick={clearFilters}
              title="Reset Filters"
            >
              <X size={16} /> Reset
            </button>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Showing <strong>{buddies.length}</strong> compatible candidates (ranked by score)
        </span>
      </div>

      {/* Grid of buddies */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading and ranking compatible study buddies...</div>
      ) : buddies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>No study buddies matched your filters</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Try broadening your search keywords or resetting the university and year filters.
          </p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }} onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {buddies.map((buddy) => (
            <BuddyCard
              key={buddy.user.id}
              buddy={buddy}
              onConnect={handleConnect}
              onViewBreakdown={handleViewBreakdown}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <CompatibilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buddy={selectedBuddy}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default SearchBuddiesPage;
