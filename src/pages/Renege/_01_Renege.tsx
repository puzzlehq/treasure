import { useNavigate } from 'react-router-dom';
import Versus from '@components/Versus.js';
import PageHeader from '@components/PageHeader.js';
import Wager from '@components/Wager.js';
import Button from '@components/Button.js';
import { useRenegeStore } from './store';
import { Box } from '@components/Box';

const RenegeGame = () => {
  const navigate = useNavigate();

  const [opponent, wager, renege, close] = useRenegeStore((state) => [
    state.opponent,
    state.wager,
    state.renege,
    state.close,
  ]);

  return (
    <Box>
      <PageHeader bg='bg-primary-red' text='Renege CHALLENGE' />
      <Versus versus={opponent ?? ''} />
      <Wager wagerAmount={wager ?? -1} />
      <div className='flex flex-grow flex-col' />
      <div className='flex w-full flex-col gap-4'>
        <Button
          color='red'
          onClick={async () => {
            await renege();
            navigate('/');
            close();
          }}
        >
          RENEGE
        </Button>
        <Button
          color='gray'
          onClick={() => {
            navigate('/');
            close();
          }}
        >
          CANCEL
        </Button>
      </div>
    </Box>
  );
};

export default RenegeGame;
