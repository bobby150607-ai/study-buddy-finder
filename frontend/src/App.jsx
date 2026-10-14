import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SubjectSelectionPage from './pages/SubjectSelectionPage';
import SearchBuddiesPage from './pages/SearchBuddiesPage';
import ConnectionsPage from './pages/ConnectionsPage';
import StudyGroupsPage from './pages/StudyGroupsPage';
import GroupDetailsChatPage from './pages/GroupDetailsChatPage';
import DirectChatPage from './pages/DirectChatPage';
import SettingsPage from './pages/SettingsPage';

// Authenticated layout wrapper
const DashboardLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/find-buddies" element={<SearchBuddiesPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/study-groups" element={<StudyGroupsPage />} />
              <Route path="/groups/:id" element={<GroupDetailsChatPage />} />
              <Route path="/chat/:buddyId" element={<DirectChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/select-subjects" element={<SubjectSelectionPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
