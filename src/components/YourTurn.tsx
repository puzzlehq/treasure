import { useNavigate } from 'react-router-dom';
import Button from './Button.js';
import { Game, useGameStore } from '@state/gameStore.js';
import { shortenAddress } from '@puzzlehq/sdk';
import {
  AcceptGameButton,
  SubmitWagerButton,
} from '../pages/AcceptGame/index.js';

function YourTurnItem({ game }: { game: Game }) {
  const user = game.gameNotification.recordData.owner;
  const opponent_address = game.gameNotification.recordData.opponent_address;
  const challenger_address =
    game.gameNotification.recordData.challenger_address;
  const vs = user === opponent_address ? challenger_address : opponent_address;
  const wager = game.gameNotification.recordData.total_pot / 2;

  const navigate = useNavigate();
  const [setCurrentGame] = useGameStore((state) => [state.setCurrentGame]);

  const renderActionButton = () => {
    switch (game.gameAction) {
      case 'Submit Wager':
        return <SubmitWagerButton game={game} />;
      case 'Accept':
        return <AcceptGameButton game={game} />;
      case 'Reveal':
        return (
          <Button
            onClick={() => {
              setCurrentGame(game);
              navigate(
                `/reveal-answer/${game.gameNotification.recordData.game_multisig}`
              );
            }}
            size='md'
            color='yellow'
          >
            Reveal
          </Button>
        );
      case 'Lose':
        return (
          <Button
            onClick={() => {
              setCurrentGame(game);
              navigate(
                `/finish-game/lose/${game.gameNotification.recordData.game_multisig}`
              );
            }}
            size='md'
            color='yellow'
          >
            See Answer
          </Button>
        );
      case 'Claim':
        return (
          <Button
            onClick={() => {
              setCurrentGame(game);
              navigate(
                `/finish-game/win/${game.gameNotification.recordData.game_multisig}`
              );
            }}
            color='yellow'
            size='md'
          >
            View Result
          </Button>
        );
    }
  };

  return (
    <div className='mb-2 grid w-full grid-cols-[1fr,auto,1fr] items-center gap-5'>
      <div className='my-auto self-center text-left text-sm sm:text-base font-bold tracking-tight text-primary-pink max-sm:ml-2'>
        {shortenAddress(vs)}
      </div>
      <div className='my-auto self-center text-left text-sm sm:text-base font-bold tracking-tight text-primary-pink max-sm:ml-2'>
        {wager} pieces
      </div>
      <div className='flex justify-end'>{renderActionButton()}</div>
    </div>
  );
}

function YourTurn({ games }: { games: Game[] }) {
  return (
    <section className='flex grow flex-col rounded-b-[10px] rounded-tr-[10px] border-2 border-solid border-bg2 bg-bg1 pb-6'>
      <div className='flex max-w-full flex-col self-start bg-bg2 px-5 py-2'>
        <div className='self-center whitespace-nowrap text-left text-xs font-extrabold leading-3'>
          YOUR TURN
        </div>
      </div>
      <div className='flex flex-col px-5 pt-2'>
        {games.map((game, ix) => (
          <YourTurnItem key={ix} game={game} />
        ))}
      </div>
    </section>
  );
}

export default YourTurn;
