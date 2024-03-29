import Home from './pages/Home.js';
import NewGameVsPerson from './pages/NewGame/vs_person/index.js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { AppHeader } from '@components/Header.js';
import { Welcome } from './pages/Welcome.js';
import { useAccount, useOnSessionDelete } from '@puzzlehq/sdk';
import AcceptGame from './pages/AcceptGame/index.js';
import { LoseRoute } from './pages/FinishGame/Lose/index.js';
import WinRoute from './pages/FinishGame/Win/index.js';
import RenegeGame from './pages/Renege/_01_Renege.js';
import { useInitGame } from './hooks/initGame.js';
import RevealAnswer from './pages/RevealAnswer/index.js';
import MapImage from '@components/MapImage.js';
import GameIntroduction from '@pages/GameIntroduction/index.js';
import NewGame from '@pages/NewGame/index.js';
import AleoIntroduction from '@pages/AleoIntroduction/index.js';
import { useEffect } from 'react';

const Rerouter = () => {
  const navigate = useNavigate();

  useOnSessionDelete(() => {
    navigate('/');
  });

  return <></>;
};

function App() {
  const { account } = useAccount();

  useEffect(() => {
    console.log('account', account);
  }, [account]);
  
  useInitGame();

  return (
    <div className='flex min-h-screen justify-center bg-gradient-to-b from-[#7CF7FF] to-[#0DD4FF] font-body text-xs sm:text-base'>
      <Router>
        <div className='z-10 flex w-full max-w-screen-sm flex-col overflow-y-auto'>
          <Rerouter />
          <div className='flex w-full max-w-screen-sm flex-col overflow-y-auto'>
            {account && account?.address && <AppHeader />}
            <div className='h-full w-full max-w-screen-sm p-4'>
              <Routes>
                <Route index element={account ? <Home /> : <Welcome />} />
                <Route path='/new-game'>
                  <Route index element={<NewGame />} />
                  <Route path='vs_bot' element={<NewGameVsPerson/>} />
                  <Route path='vs_person' element={<NewGameVsPerson/>} />
                </Route>
                <Route
                  path='/renege-game/:game_multisig'
                  element={<RenegeGame />}
                />
                <Route
                  path='/accept-game/:game_multisig'
                  element={<AcceptGame />}
                />
                <Route
                  path='/reveal-answer/:game_multisig'
                  element={<RevealAnswer />}
                />
                <Route path='/finish-game'>
                  <Route path='win/:game_multisig' element={<WinRoute />} />
                  <Route path='lose/:game_multisig' element={<LoseRoute />} />
                </Route>
                <Route path='/aleo-info' element={<AleoIntroduction/>} />
                <Route path='/game-info' element={<GameIntroduction/>} />
              </Routes>
            </div>
          </div>
        </div>
        <MapImage />
      </Router>
    </div>
  );
}

export default App;
