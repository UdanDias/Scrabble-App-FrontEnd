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
import { Home } from './components/consoles/Home';
// import { Home } from './components/consoles/Home';
// import { UnAuthHome } from './components/consoles/unAuthHome';
import { HomeAfter } from './components/consoles/HomeAfter';


function AppLayout() {
  const location = useLocation();
  const isAuthPage = ['/', '/signin', '/signup', '/home'].includes(location.pathname);

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
            boxSizing: 'border-box'
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />}/>
            {/* <Route path="/unauthhome" element={<UnAuthHome />} />  */}
            <Route path="/home" element={<Home />} /> 
            <Route path="/homeafter" element={<HomeAfter />} />

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




//     <div style={{ paddingTop: '60px', maxWidth: '100vw', overflowX: 'hidden' }}>
//         <NavBar />
//         <div style={{ display: 'flex' }}>
//             {!isAuthPage && <Sidebar />}
//             <div
//             style={{
//               flex: 1,
//               marginLeft: isAuthPage ? 0 : '220px',
//               boxSizing: 'border-box',
//               backgroundColor: '#0d1117',
//               minHeight: '100vh',
//               overflowX: 'hidden'
//             }}
// >
//           <Routes>
//             <Route path="/" element={<Navigate to="/signin" />} />
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/user" element={<UserConsole />} />
//             <Route path="/player" element={<PlayerConsole />} />
//             <Route path="/tournament" element={<TournamentConsole />} />
//             <Route path="/game" element={<GameConsole />} />
//             <Route path="/leaderboard" element={<LeaderBoard />} />
//           </Routes>
//         </div>
//       </div>
//     </div>