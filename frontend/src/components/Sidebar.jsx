import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Users, 
  UserCheck, 
  BookOpen, 
  User, 
  Layers, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Compass size={18} /> },
    { name: 'Find Study Buddies', path: '/find-buddies', icon: <Users size={18} /> },
    { name: 'Connections', path: '/connections', icon: <UserCheck size={18} /> },
    { name: 'Study Groups', path: '/study-groups', icon: <BookOpen size={18} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={18} /> },
    { name: 'Select Subjects', path: '/select-subjects', icon: <Layers size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">SB</div>
        <div className="brand-text">
          <h1>Study Buddy</h1>
          <span>University Network</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="user-snippet">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'User'}`}
              alt="Avatar"
              className="avatar-img"
            />
            <div className="user-meta">
              <h4>{user?.name || 'Student'}</h4>
              <p>{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
