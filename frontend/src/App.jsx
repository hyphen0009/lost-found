import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Search, Briefcase, PlusCircle, Folder, Trophy, LogOut, UserPlus, LogIn, Info, Bell } from 'lucide-react';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import Login from './pages/Login';
import Register from './pages/Register';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import ClaimsManager from './pages/ClaimsManager';
import MyClaims from './pages/MyClaims';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';
import appIcon from './assets/icon.png';
import { subscribeToPush } from './push-notifications';
import InstallPrompt from './components/InstallPrompt';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <Search size={22} className="nav-icon" />
        <span>Home</span>
      </Link>

      <Link to={user ? "/my-claims" : "/login"} className={`nav-item ${isActive('/my-claims') ? 'active' : ''}`}>
        <Briefcase size={22} className="nav-icon" />
        <span>Claims</span>
      </Link>
      
      <Link to={user ? "/add" : "/login"} className="post-fab">
        <PlusCircle size={32} color="white" strokeWidth={2.5} />
      </Link>

      <Link to={user ? "/manage-claims" : "/login"} className={`nav-item ${isActive('/manage-claims') ? 'active' : ''}`}>
        <Folder size={22} className="nav-icon" />
        <span>My Posts</span>
      </Link>

      <Link to="/leaderboard" className={`nav-item ${isActive('/leaderboard') ? 'active' : ''}`}>
        <Trophy size={22} className="nav-icon" />
        <span>Ranks</span>
      </Link>
    </div>
  );
};

const Header = () => {
  const { user, logout } = useAuth();

  const handleEnableNotifications = async () => {
    try {
      await subscribeToPush();
      alert('Notifications enabled! You will now receive alerts for your claims.');
    } catch (err) {
      console.error(err);
      alert('Failed to enable notifications. Please check your browser settings.');
    }
  };
  
  return (
    <header className="header-minimal">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="logo-mobile" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={appIcon} alt="Lost & Found" style={{ height: '64px', width: 'auto', borderRadius: '8px' }} />
        </Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleEnableNotifications} className="icon-btn-secondary" title="Enable Notifications">
              <Bell size={18} />
            </button>
            <Link to="/about" className="icon-btn-secondary" title="About">
              <Info size={18} />
            </Link>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1f2937' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '0.5px' }}>{user.respectPoints} PTS</div>
            </div>
            <button onClick={logout} className="icon-btn-secondary">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link to="/about" className="icon-btn-secondary" title="About">
              <Info size={18} />
            </Link>
            <Link to="/login" className="btn-header-outline">
              <LogIn size={14} style={{ marginRight: '4px' }} /> Login
            </Link>
            <Link to="/register" className="btn-header-filled">
              <UserPlus size={14} style={{ marginRight: '4px' }} /> Join
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <InstallPrompt />
        <Header />
        <main style={{ paddingBottom: '5rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            <Route path="/manage-claims" element={<ProtectedRoute><ClaimsManager /></ProtectedRoute>} />
            <Route path="/my-claims" element={<ProtectedRoute><MyClaims /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <BottomNav />
      </Router>
    </AuthProvider>
  );
}

export default App;
