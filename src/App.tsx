import './App.css';
import  {PlayerConsole}  from './components/PlayerConsole';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import { GameConsole } from './components/GameConsole';

function App() {
  return (
    <>
      <NavBar/>
      <GameConsole/>
      {/* <PlayerConsole/>  */}
    </>
  );
}

export default App;
