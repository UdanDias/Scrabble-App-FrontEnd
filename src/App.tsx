import './App.css';
import  {PlayerConsole}  from './components/PlayerConsole';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import { GameConsole } from './components/GameConsole';
import { Profile } from './components/Profile';
import { LeaderBoard } from './components/LeaderBoard';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './components/auth/AuthProvider';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <NavBar/>
          <Routes>

            <Route path="/" element={<SignUp/>}/>
            <Route path="/player" element={<PlayerConsole/>}/>
            <Route path="/game" element={<GameConsole/>}/>
            <Route path="/leaderboard" element={<LeaderBoard/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
