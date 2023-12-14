/* eslint-disable @typescript-eslint/no-explicit-any */
import GameInfo from '@components/GameInfo';
import Button from '@components/Button';
import NavDots from '@components/Nav';
import { useAcceptGameStore } from './store';
import { useEventHandling } from '@hooks/eventHandling';
import { useGameStore } from '@state/gameStore';

function Confirmed(props: { done: () => void }) {
  const [eventIdAccept] = useAcceptGameStore((state) => [
    state.eventIdAccept,
  ]);

  const [currentGame] = useGameStore((state) => [state.currentGame]);
  const { event } = useEventHandling({
    id: eventIdAccept,
    stepName: 'Accept Confirmed'
  });

  console.log('event');

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex h-full w-full flex-col items-center'>
        <NavDots step={2} totalSteps={3} />
        <GameInfo
          multisig={currentGame?.gameNotification.recordData.game_multisig}
          transactionId={event?.transactionId}
          title='GAME ACCEPTED!'
        />
        <div className='flex flex-grow flex-col' />
        <div className='flex flex-col gap-4'>
          <Button onClick={props.done} color='transparent'>
            GO HOME
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Confirmed;
