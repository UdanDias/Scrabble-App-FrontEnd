import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';

import { PlayerConsole } from './components/consoles/PlayerConsole';
import { TournamentConsole } from './components/consoles/TournamentConsole';
import { GameConsole } from './components/consoles/GameConsole';
import { Profile } from './components/consoles/Profile';
import { UserConsole } from './components/consoles/UserConsole';
import { LeaderBoard } from './components/consoles/LeaderBoard';
import Sidebar from './components/consoles/SideBar';
import NavBar from './components/consoles/NavBar';
import { Home } from './components/consoles/Home';
import { HomeAfter } from './components/consoles/HomeAfter';
import Footer from './components/consoles/Footer';
import { PairingsConsole } from './components/consoles/PairingConsole';
import { TeamsConsole } from './components/consoles/TeamConsole';

function AppLayout() {
  const { role, loading } = useAuth();
  const isAdmin = role === "ROLE_ADMIN";
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(60);

  const isAuthPage = ['/', '/signin', '/signup', '/home'].includes(location.pathname);

  // Measure real navbar height and keep CSS variable in sync
  const syncNavbarHeight = () => {
    const navbar = document.querySelector('.custom-navbar') as HTMLElement;
    if (navbar) {
      const height = Math.ceil(navbar.getBoundingClientRect().height);
      setNavbarHeight(height);
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }
  };

  // On mount + every resize
  useEffect(() => {
    syncNavbarHeight();
    window.addEventListener('resize', syncNavbarHeight);
    return () => window.removeEventListener('resize', syncNavbarHeight);
  }, []);

  // Re-measure on route change (nav items may change, affecting height)
  useEffect(() => {
    // Small delay so the DOM has updated before measuring
    const t = setTimeout(syncNavbarHeight, 50);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Reset sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#0d1117',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: navbarHeight }}>
      {/* Navbar — fixed, height is measured dynamically */}
      <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Backdrop — mobile only, dims content when sidebar is open */}
      {!isAuthPage && (
        <div
          className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main flex row: sidebar + content */}
      <div className="app-body">
        {!isAuthPage && (
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}

        <main
          className={`main-content ${
            isAuthPage
              ? 'no-sidebar'
              : sidebarOpen
              ? 'sidebar-open'
              : 'sidebar-closed'
          }`}
        >
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/homeafter" element={<HomeAfter />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/user"
                element={isAdmin ? <UserConsole /> : <Navigate to="/leaderboard" />}
              />
              <Route
                path="/game"
                element={isAdmin ? <GameConsole /> : <Navigate to="/leaderboard" />}
              />
              <Route
                path="/player"
                element={isAdmin ? <PlayerConsole /> : <Navigate to="/leaderboard" />}
              />
              <Route path="/tournament" element={<TournamentConsole />} />
              <Route
                path="/teams"
                element={isAdmin ? <TeamsConsole /> : <Navigate to="/leaderboard" />}
              />
              <Route path="/pairings" element={<PairingsConsole />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;