/* eslint-disable @typescript-eslint/no-explicit-any */
import GameInfo from '@components/GameInfo.js';
import Button from '@components/Button.js';
import { useNewGameVsPersonStore } from './store';
import { useEvent } from '@puzzlehq/sdk';
import Nav from '@components/Nav';

function GameStarted(props: { done: () => void }) {
  const [inputs, eventId] = useNewGameVsPersonStore((state) => [
    state.inputs,
    state.eventId,
  ]);
  const game_multisig = inputs?.game_multisig;

  const { event } = useEvent({ id: eventId });

  return (
    <div className='flex h-full flex-col justify-between items-center'>
      <Nav step={4} totalSteps={5}/>
      {game_multisig && event && event.transactionId && (
        <GameInfo
          multisig={game_multisig}
          transactionId={event.transactionId}
          newGame={true}
        />
      )}
      <div className='flex flex-grow' />
      <Button onClick={props.done} color='transparent'>
        GO HOME
      </Button>
    </div>
  );
}

export default GameStarted;
