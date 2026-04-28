import { createContext, useContext, useState, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users as UsersIcon,
  Sparkles,
  BarChart3,
  Settings,
  Bell,
  Search,
  UserCircle,
  LogOut
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Experiences from './components/Experiences';
import Analytics from './components/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import SettingsPage from './components/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider, useSearch } from './context/SearchContext';

function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: UsersIcon },
    { name: 'Experiences', path: '/experiences', icon: Sparkles },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="sidebar glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 12px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'var(--primary)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontFamily: 'serif'
        }}>Co</div>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Admin</h1>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button onClick={() => signOut()} className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function Header() {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '40px'
    }}>
      <div style={{ position: 'relative', width: '300px' }}>
        <Search size={18} style={{ 
          position: 'absolute', 
          left: '12px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }} />
        <input 
          type="text" 
          placeholder="Search matches, users..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%',
            padding: '14px 14px 14px 44px',
            borderRadius: '16px',
            border: 'none',
            background: 'var(--surface)',
            fontSize: '15px',
            outline: 'none',
            boxShadow: 'var(--shadow)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{ 
          position: 'relative',
          padding: '8px',
          borderRadius: '10px',
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
          <Bell size={20} color="var(--text-secondary)" />
          <div style={{ 
            position: 'absolute', 
            top: '8px', 
            right: '8px', 
            width: '8px', 
            height: '8px', 
            background: 'var(--primary)', 
            borderRadius: '50%',
            border: '2px solid var(--surface)'
          }} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Admin</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.email}</div>
          </div>
          <UserCircle size={32} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Demo Override: Do not allow /login to render, immediately redirect back to app
  if (isLoginPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="content">
        <Header />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/experiences" element={<ProtectedRoute><Experiences /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
