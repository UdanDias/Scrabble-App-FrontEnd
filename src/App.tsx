import React, { useEffect } from 'react';
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
  
  
  const isAuthPage = ['/', '/signin', '/signup', '/home'].includes(location.pathname);

  // BUG FIX: Instead of returning null (blank screen), 
  // show your loading animation here so it's visible on first load.
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#0d1117', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'white' 
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '60px' }}>
      <NavBar />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {!isAuthPage && <Sidebar />}
        <div
          style={{
            flex: 1,
            marginLeft: isAuthPage ? 0 : '220px',
            backgroundColor: '#0d1117',
            minHeight: '100vh',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/homeafter" element={<HomeAfter />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user" element={isAdmin ? <UserConsole /> : <Navigate to="/leaderboard" />} />
              <Route path="/game" element={isAdmin ? <GameConsole /> : <Navigate to="/leaderboard" />} />
              <Route path="/player" element={<PlayerConsole />} />
              <Route path="/tournament" element={<TournamentConsole />} />
              <Route path="/teams" element={isAdmin ? <TeamsConsole /> : <Navigate to="/leaderboard" />} />
              <Route path='/pairings' element={<PairingsConsole />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  // FORCE REFRESH LOGIC
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('app_initialized');
    if (!hasRefreshed) {
      sessionStorage.setItem('app_initialized', 'true');
      window.location.reload();
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;