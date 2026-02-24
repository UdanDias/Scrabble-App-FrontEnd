import './App.css';
import  {PlayerConsole}  from './components/PlayerConsole';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import { GameConsole } from './components/GameConsole';
import { Profile } from './components/Profile';
import { LeaderBoard } from './components/LeaderBoard';

function App() {
  return (
    <>
      <NavBar/>
      {/* <PlayerConsole/>  */}
      {/* <GameConsole/> */}
      {<LeaderBoard/>}
    </>
  );
}

export default App;
