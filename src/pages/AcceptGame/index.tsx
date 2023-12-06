import SubmitWager from './_01_SubmitWager';
import AcceptGamePage from './_02_AcceptGame';
import Confirmed from './_03_Confirmed';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Step, useAcceptGameStore } from './store';
import { Game, useGameStore } from '@state/gameStore';
import Button from '@components/Button';
import { useEffect } from 'react';
import { useInitCurrentGame } from '@hooks/currentGame';
import { useEventHandling } from '@hooks/eventHandling';

export const SubmitWagerButton = ({ game }: { game: Game }) => {
  const [initializeSubmitWager] = useAcceptGameStore((state) => [
    state.initializeSubmitWager,
  ]);
  const [setCurrentGame] = useGameStore((state) => [state.setCurrentGame]);
  const navigate = useNavigate();

  const [largestPiece, availableBalance] = useGameStore((state) => [
    state.largestPiece,
    state.availableBalance,
  ]);
  const puzzleRecord =
    availableBalance >= game.gameNotification.recordData.total_pot / 2
      ? largestPiece
      : undefined;

  return (
    <Button
      onClick={() => {
        const key_record = game.utilRecords[0];
        const game_req_notification = game.gameNotification.recordWithPlaintext;
        if (!puzzleRecord || !key_record || !game_req_notification) return;
        initializeSubmitWager(puzzleRecord, key_record, game_req_notification);
        setCurrentGame(game);
        navigate(
          `/accept-game/${game.gameNotification.recordData.game_multisig}`
        );
      }}
      color='green'
      size='md'
      disabled={puzzleRecord === undefined}
    >
      Submit Wager
    </Button>
  );
};

export const AcceptGameButton = ({ game }: { game: Game }) => {
  const [setCurrentGame] = useGameStore((state) => [state.setCurrentGame]);
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        setCurrentGame(game);
        navigate(
          `/accept-game/${game.gameNotification.recordData.game_multisig}`
        );
      }}
      color='green'
      size='md'
    >
      Accept
    </Button>
  );
};

const AcceptGame = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [
    step,
    eventIdSubmit,
    eventIdAccept,
    eventIdFund,
    setStep,
    setAcceptGameInputs,
    setSubmitWagerInputs,
    setEventIdSubmit,
    setEventIdAccept,
    setEventIdFund
  ] = useAcceptGameStore((state) => [
    state.step,
    state.eventIdSubmit,
    state.eventIdAccept,
    state.eventIdFund,
    state.setStep,
    state.setAcceptGameInputs,
    state.setSubmitWagerInputs,
    state.setEventIdSubmit,
    state.setEventIdAccept,
    state.setEventIdFund
  ]);

  const { currentGame } = useInitCurrentGame();
  useEffect(() => {
    const _eventIdSubmit = searchParams.get('eventIdSubmit');
    const _eventIdAccept = searchParams.get('eventIdAccept');
    const _eventIdFund = searchParams.get('eventIdFund');
    if (_eventIdSubmit) {
      setEventIdSubmit(_eventIdSubmit);
    }
    if (_eventIdAccept) {
      setEventIdAccept(_eventIdAccept);
    }
    if (_eventIdFund) {
      setEventIdFund(_eventIdFund);
    }

  }, [searchParams]);

  useEventHandling({
    id: eventIdSubmit,
    onSettled: () => setStep(Step._02_AcceptGame),
  });
  useEventHandling({
    id: eventIdAccept,
    address: currentGame?.gameNotification.recordData.game_multisig,
    multisig: true,
    onSettled: () => setStep(Step._03_Confirmed),
  });

  useEventHandling({
    id: eventIdFund,
  });

  const done = () => {
    setAcceptGameInputs({});
    setSubmitWagerInputs({});
    setStep(Step._01_SubmitWager);
    navigate('/');
  };

  return (
    <div className='flex h-full w-full flex-col'>
      {step === Step._01_SubmitWager && <SubmitWager />}
      {step === Step._02_AcceptGame && <AcceptGamePage />}
      {step === Step._03_Confirmed && <Confirmed done={done} />}
    </div>
  );
};

export default AcceptGame;
