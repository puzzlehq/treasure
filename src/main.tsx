/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PuzzleWalletProvider } from '@puzzlehq/sdk';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className='h-screen w-screen'>
    <PuzzleWalletProvider
      dAppName="Treasure Hunt"
      dAppDescription='A friendly wager between friends'
      dAppUrl='https://treasures.puzzle.online'
      dAppIconURL='https://i.imgur.com/TXRCKod.png'
    >
      <App />
    </PuzzleWalletProvider>
  </div>
);
