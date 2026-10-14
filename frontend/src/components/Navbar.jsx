import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';

const Navbar = () => {
  const { user } = useAuth();
  const [incomingCount, setIncomingCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchIncoming = async () => {
      try {
        const res = await api.get('/connections/requests');
        if (isMounted && res.data?.success && res.data?.data?.incoming) {
          setIncomingCount(res.data.data.incoming.length);
        }
      } catch (e) {
        // silent
      }
    };

    fetchIncoming();
    const interval = setInterval(fetchIncoming, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="badge badge-primary">
          <Sparkles size={13} /> University Network
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Welcome back, <strong>{user?.name}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/connections" className="btn btn-secondary btn-sm" title="Messages and Connections">
          <MessageSquare size={16} /> Connections
          {incomingCount > 0 && (
            <span
              className="badge"
              style={{
                background: 'var(--danger)',
                color: '#fff',
                fontSize: '11px',
                padding: '2px 6px',
                marginLeft: '4px',
              }}
            >
              {incomingCount} new
            </span>
          )}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'User'}`}
            alt="User Avatar"
            style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
