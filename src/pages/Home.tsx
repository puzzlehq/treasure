import { useNavigate } from 'react-router-dom';
import Button from '@components/Button';
import TotalWinnings from '@components/TotalWinnings';
import TheirTurn from '@components/TheirTurn';
import YourTurn from '@components/YourTurn';
import { useGameStore } from '@state/gameStore';
import { useNewGameVsPersonStore } from './NewGame/vs_person/store';
import { useAccount } from '@puzzlehq/sdk';
import { useGameIntroStore } from './GameIntroduction/store';
import { useEffect } from 'react';

function Home() {
  const [yourTurn, theirTurn, totalBalance] = useGameStore((state) => [
    state.yourTurn,
    state.theirTurn,
    state.totalBalance,
  ]);
  const [initialize] = useNewGameVsPersonStore((state) => [state.initialize]);
  const { account } = useAccount();
  const navigate = useNavigate();

  const [visited] = useGameIntroStore((state) => [state.visited]);

  useEffect(() => {
    if (!visited) {
      navigate('/game-introduction')
    }
  }, [])

  return (
    <div className='flex h-full flex-col justify-between '>
      <div className='flex w-full flex-col gap-4 px-1'>
        <TotalWinnings amount={totalBalance} />
        <Button
          color='yellow'
          onClick={() => {
            if (!account) return;
            initialize(account?.address);
            navigate('/new-game');
          }}
          disabled={!account}
        >
          NEW GAME
        </Button>
        {yourTurn.length > 0 && <YourTurn games={yourTurn} />}
        {theirTurn.length > 0 && <TheirTurn games={theirTurn} />}
        {yourTurn.length === 0 && theirTurn.length === 0 && (
          <p className='self-center font-semibold'>
            No ongoing games, start one with a friend!
          </p>
        )}
      </div>
      <div className='mt-4 pb-4 text-center'>
        {' '}
        {/* Adding px-4 back here to maintain padding for the bottom button */}
        <Button color='blue' size='md'>
          Past Games
        </Button>
      </div>
    </div>
  );
}

export default Home;
