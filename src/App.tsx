import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from './components/auth/AuthProvider';
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

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ['/', '/signin', '/signup'].includes(location.pathname);

  return (
    <div>
      {!isAuthPage && <NavBar />}
      <div style={{ display: 'flex' }}>
        {!isAuthPage && <Sidebar />}
                  <div style={{ 
                    marginLeft: isAuthPage ? '0' : '220px', 
                    width: isAuthPage ? '100%' : 'calc(100% - 220px)',  /* key fix */
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    
                }}>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<UserConsole />} />
            <Route path="/player" element={<PlayerConsole />} />
            <Route path="/tournament" element={<TournamentConsole />} />
            <Route path="/game" element={<GameConsole />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
          </Routes>
        </div>
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