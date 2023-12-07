import { useNavigate } from 'react-router-dom';
import { useRenegeStore } from '../pages/Renege/store';
import Button from './Button';
import { Game, useGameStore } from '@state/gameStore';
import { shortenAddress } from '@puzzlehq/sdk';

function TheirTurnItem({ game }: { game: Game }) {
  const user = game.gameNotification.recordData.owner;
  const opponent_address = game.gameNotification.recordData.opponent_address;
  const challenger_address =
    game.gameNotification.recordData.challenger_address;
  const vs = user === opponent_address ? challenger_address : opponent_address;
  const wager = game.gameNotification.recordData.total_pot / 2;

  const navigate = useNavigate(); // Hook to navigate
  const [setCurrentGame] = useGameStore((state) => [state.setCurrentGame]);

  // Function to handle the ping button click
  const handlePingClick = () => {
    // You might want to replace 'ENTER_PHONE_NUMBER' with the actual number if needed
    const phoneNumber = 'ENTER_PHONE_NUMBER'; // Leave this as is if you want the user to enter the number.
    let message = `I'm betting you puzzle pieces that you can't find where I hid the booty! Go to https://treasures.puzzle.online to play!`;
    switch (game.gameState) {
      case 'challenger:1':
      case 'challenger:2':{
        message = `${
          game.gameNotification.recordData.total_pot / 2
          } puzzle pieces are on the line. Go to https://treasures.puzzle.online to find the booty!`;
        break;
      }
      case 'opponent:3': {
        message = `Results are in and ${
          game.gameNotification.recordData.total_pot / 2
          } puzzle pieces are on the line. Go to https://treasures.puzzle.online to see if you won!`;
        break;
      } case 'loser:4': {
        message = `I lost, and you won ${
          game.gameNotification.recordData.total_pot / 2
          } puzzle pieces!. Go to https://treasures.puzzle.online to claim your prize!`;
        break;
      }
    }
    const encodedMessage = encodeURIComponent(message);
    const smsHref = `sms:${phoneNumber}?&body=${encodedMessage}`;

    window.location.href = smsHref;
  };

  const renderActionButton = () => {
    switch (game.gameAction) {
      case 'Ping':
      case 'Renege':
        // Assuming 'Claim' needs a special button not shown in this snippet
        // This is just an example
        return (
          <div className='flex gap-2'>
            <Button onClick={handlePingClick} color='pink' size='md'>
              Ping
            </Button>
          </div>
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
            color='gray'
          >
            See Answer
          </Button>
        );
    }
  };

  return (
    <div className='mb-2 grid w-full grid-cols-[1fr,auto,1fr] items-center gap-5'>
      <div className='my-auto self-center text-left text-base font-bold '>
        {shortenAddress(vs)}
      </div>
      <div className='my-auto self-center text-left text-base font-bold'>
        {wager} pieces
      </div>
      <div className='flex justify-end'>{renderActionButton()}</div>
    </div>
  );
}

function TheirTurn({ games }: { games: Game[] }) {
  return (
    <section className='flex grow flex-col self-stretch rounded-b-[5px] border-2 border-solid border-bg2 bg-bg1 pb-6'>
      <div className='flex max-w-full flex-col self-start bg-bg2 px-5 py-2'>
        <div className='self-center whitespace-nowrap text-left text-xs font-extrabold leading-3'>
          THEIR TURN
        </div>
      </div>
      <div className='flex flex-col px-5 pt-2'>
        {games.map((game, ix) => (
          <TheirTurnItem key={ix} game={game} />
        ))}
      </div>
    </section>
  );
}

export default TheirTurn;
