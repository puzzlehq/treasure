/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PuzzleWalletProvider } from '@puzzlehq/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className='h-screen w-screen'>
    <QueryClientProvider client={queryClient}>
      <PuzzleWalletProvider
        dAppName="Treasure Hunt"
        dAppDescription='A friendly wager between friends'
        dAppUrl='https://treasures.puzzle.online'
        dAppIconURL='https://i.imgur.com/TXRCKod.png'
      >
        <App />
      </PuzzleWalletProvider>
    </QueryClientProvider>
  </div>
);
