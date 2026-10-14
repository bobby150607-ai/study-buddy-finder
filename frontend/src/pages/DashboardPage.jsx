import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';
import BuddyCard from '../components/BuddyCard';
import CompatibilityModal from '../components/CompatibilityModal';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Layers,
  Clock
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({ connectionsCount: 0, groupsCount: 0, totalBuddies: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [recRes, connRes, grpRes] = await Promise.all([
        api.get('/buddies/recommendations'),
        api.get('/connections'),
        api.get('/groups'),
      ]);

      if (recRes.data?.success) {
        setRecommendations(recRes.data.data);
      }

      const activeConnections = connRes.data?.data?.length || 0;
      const joinedGroups = grpRes.data?.data?.filter(g => g.isMember)?.length || 0;
      const totalCandidates = recRes.data?.data?.length || 0;

      setStats({
        connectionsCount: activeConnections,
        groupsCount: joinedGroups,
        totalBuddies: totalCandidates,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleConnect = async (targetUserId) => {
    try {
      const res = await api.post(`/connections/${targetUserId}`);
      if (res.data?.success) {
        setAlertMsg('Connection request sent successfully!');
        setTimeout(() => setAlertMsg(''), 4000);
        // Refresh recommendations to update connection badge
        fetchDashboardData();
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
      {/* Alert toast if any */}
      {alertMsg && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontWeight: 600,
          fontSize: '14px',
          border: '1px solid #a7f3d0'
        }}>
          ✓ {alertMsg}
        </div>
      )}

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 40px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            <Sparkles size={14} /> Smart Match Engine Active
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Hello, {user?.name}!
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6 }}>
            The buddy matching algorithm calculated real-time compatibility scores for students sharing your enrolled subjects, research interests, and preferred study schedule.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/find-buddies" className="btn" style={{ background: '#ffffff', color: 'var(--primary)', padding: '12px 20px' }}>
            <Search size={16} /> Search Buddies
          </Link>
          <Link to="/select-subjects" className="btn" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', padding: '12px 20px', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
            <Layers size={16} /> My Subjects
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Buddies</span>
            <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{stats.connectionsCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Study Groups</span>
            <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{stats.groupsCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Matched Peers</span>
            <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{stats.totalBuddies}</h3>
          </div>
        </div>
      </div>

      {/* Section: Top Recommended Study Buddies */}
      <div className="page-header">
        <div className="page-title">
          <h2>Top Recommended Study Buddies</h2>
          <p>Ranked strictly by highest algorithmic compatibility score</p>
        </div>
        <Link to="/find-buddies" className="btn btn-secondary btn-sm">
          View All Recommendations <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Computing study buddy compatibility matrix...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <Sparkles size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h3>No study buddies recommended yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 20px' }}>
            Pick your enrolled subjects and set your study preferences so the algorithm can compute matches!
          </p>
          <Link to="/select-subjects" className="btn btn-primary">
            Select Your Subjects
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {recommendations.slice(0, 6).map((buddy) => (
            <BuddyCard
              key={buddy.user.id}
              buddy={buddy}
              onConnect={handleConnect}
              onViewBreakdown={handleViewBreakdown}
            />
          ))}
        </div>
      )}

      {/* Compatibility Modal */}
      <CompatibilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buddy={selectedBuddy}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default DashboardPage;
