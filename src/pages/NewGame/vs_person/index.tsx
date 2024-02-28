import NewGamePage from './_01_NewGame';
import HideTreasure from './_02_HideTreasure';
import SetWager from './_03_SetWager';
import ConfirmStartGame from './_04_ConfirmStartGame';
import GameStarted from './_05_GameStarted';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Step, useNewGameVsPersonStore } from './store';
import { useEffect } from 'react';
import { useInitCurrentGame } from '@hooks/currentGame';
import { useEventHandling } from '@hooks/eventHandling';
import { Box } from '@components/Box';
import { useAccount } from '@puzzlehq/sdk';

const NewGameVsPerson = () => {
  const navigate = useNavigate();
  const [step, eventId, inputs, setInputs, setEventId, setStep] = useNewGameVsPersonStore((state) => [
    state.step,
    state.eventId,
    state.inputs,
    state.setInputs,
    state.setEventId,
    state.setStep,
  ]);

  const { account } = useAccount();

  useEffect(() => {
    if (!account) return;
    setInputs({ ...inputs, challenger: account.address });
  }, [account])

  const done = () => {
    setInputs({});
    setStep(Step._01_NewGame);
    navigate('/');
  };

  const [searchParams] = useSearchParams();

  useInitCurrentGame();
  useEffect(() => {
    const _eventId = searchParams.get('eventId');
    if (_eventId) {
      setEventId(_eventId);
    }
  }, [searchParams]);

  useEventHandling({
    id: eventId,
    stepName: 'Vs Person',
    onSettled: () => setStep(Step._05_GameStarted),
  });

  return (
    <Box>
      {step === Step._01_NewGame && <NewGamePage />}
      {step === Step._02_HideBooty && <HideTreasure />}
      {step === Step._03_StartWager && <SetWager />}
      {step === Step._04_ConfirmStartGame && <ConfirmStartGame />}
      {step === Step._05_GameStarted && <GameStarted done={done} />}
    </Box>
  );
};

export default NewGameVsPerson;
