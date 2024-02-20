/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PuzzleWalletProvider } from '@puzzlehq/sdk-react';
import { Toaster } from 'react-hot-toast';

export const mediaQuery = window.matchMedia("(max-width: 600px)");

export let ALEO_NETWORK_URL: string = import.meta.env.VITE_ALEO_NETWORK_URL;

fetch('https://jigsaw.puzzle.online/api/aleoAPI').then(async (response) => (ALEO_NETWORK_URL = await response.json()));


ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className='h-screen w-screen'>
    <PuzzleWalletProvider
      dAppName="Treasure Hunt"
      dAppDescription='A friendly wager between friends'
      dAppUrl='https://treasures.puzzle.online'
      dAppIconURL='https://i.imgur.com/TXRCKod.png'
    >
      <App />
      <Toaster
        position='bottom-center'
      />
    </PuzzleWalletProvider>
  </div>
);
