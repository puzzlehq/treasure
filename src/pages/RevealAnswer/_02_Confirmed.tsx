/* eslint-disable @typescript-eslint/no-explicit-any */
import GameInfo from '@components/GameInfo';
import Button from '@components/Button';
import { useGameStore } from '@state/gameStore';
import { useRevealAnswerStore } from './store';
import { useEvent } from '@puzzlehq/sdk';
import { useNavigate } from 'react-router-dom';

function Confirmed() {
  const [eventId, _close] = useRevealAnswerStore((state) => [state.eventId, state.close]);
  const [currentGame] = useGameStore((state) => [state.currentGame]);
  const navigate = useNavigate();

  const game_address = currentGame?.gameNotification.recordData.game_multisig;
  const { event } = useEvent({ id: eventId });

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex h-full w-full flex-col items-center px-5'>
        <GameInfo
          multisig={game_address}
          transactionId={event?.transactionId}
          title='ANSWER REVEALED!'
        />
        <div className='flex flex-grow flex-col' />
        <div className='flex flex-col gap-4'>
          <Button
            variant='green'
            onClick={() => {
              navigate('/');
              _close();
            }}
          >
            GO HOME
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Confirmed;
