import { useEffect, useState } from 'react';
import Button from '@components/Button.js';
import PageHeader from '@components/PageHeader.js';
import SelectedTreasureLocation from '@components/SelectedTreasureLocation.js';
import Wager from '@components/Wager.js';
import Versus from '@components/Versus.js';
import { useGameStore } from '@state/gameStore.js';
import { Answer } from '@state/RecordTypes/treasure_hunt_vxxx.js';
import {
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  transitionFees,
} from '@state/manager.js';
import { Step, useRevealAnswerStore } from './store.js';
import { EventStatus, EventType, importSharedState, requestCreateEvent } from '@puzzlehq/sdk';
import { useEventHandling } from '@hooks/eventHandling.js';
import { useSearchParams } from 'react-router-dom';
import LoadingEllipses from '@components/LoadingEllipses.js';
import { mediaQuery } from '../../main.js';
import { toast } from 'react-hot-toast';

const Reveal = () => {
  const [inputs, eventId, initialize, setEventId, setStep] =
    useRevealAnswerStore((state) => [
      state.inputsRevealAnswer,
      state.eventId,
      state.initialize,
      state.setEventId,
      state.setStep,
    ]);
  const [currentGame] = useGameStore((state) => [
    state.currentGame,
  ]);

  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventId,
    stepName: 'Reveal',
    onSettled: () => setStep(Step._02_Confirmed),
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (
      !currentGame
    )
      return;
    const reveal_answer_notification_record =
      currentGame.gameNotification.recordWithPlaintext;

    const challenger_answer_record = currentGame.records.find(
      (r) => r.data.ix === '26u32'
    );

    const joint_piece_stake = currentGame.records.find(
      (r) => r.data.ix === '10u32'
    );

    const challenger_claim_signature = currentGame.records.find(
      (r) => r.data.ix === '7u32'
    );

    console.log(
      'reveal_answer_notification_record',
      reveal_answer_notification_record
    );
    console.log('challenger_answer_record', challenger_answer_record);
    console.log('joint_piece_stake', joint_piece_stake);
    console.log('challenger_claim_signature', challenger_claim_signature);

    if (
      !reveal_answer_notification_record ||
      !challenger_answer_record ||
      !joint_piece_stake ||
      !challenger_claim_signature
    )
      return;

    initialize(
      reveal_answer_notification_record,
      challenger_answer_record,
      joint_piece_stake,
      challenger_claim_signature
    );
  }, [
    currentGame?.gameNotification.recordData.game_multisig,
    [currentGame?.records].toString(),
  ]);
  const opponent = currentGame?.gameNotification.recordData.challenger_address;
  const wagerAmount =
    (currentGame?.gameNotification.recordData.total_pot ?? 0) / 2;
  const answer =
    inputs?.challenger_answer_record?.data.answer === '0field'
      ? Answer.left
      : Answer.right;

  const createEvent = async () => {
    if (
      !inputs?.reveal_answer_notification_record ||
      !inputs?.challenger_answer_record ||
      !inputs?.joint_piece_stake ||
      !inputs?.challenger_claim_signature
    )
      return;
    setLoading(true);
    setError(undefined);
    const createEventPromise = requestCreateEvent({
      type: EventType.Execute,
      programId: GAME_PROGRAM_ID,
      functionId: GAME_FUNCTIONS.reveal_answer,
      fee: transitionFees.reveal_answer,
      inputs: Object.values(inputs),
    });

    const createEventMessage = mediaQuery.matches ? 'Open Puzzle Wallet to reveal' : 'Accept the request';
    toast.promise(createEventPromise, {
      loading: createEventMessage,
      success: 'Event created!',
      error: (e) => e
    })
    const response = await createEventPromise;

    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else if (response.eventId) {
      console.log('success!', response.eventId);
      setEventId(response.eventId);
      setSearchParams({ eventId: response.eventId });
    }
  };

  const [buttonText, setButtonText] = useState('REVEAL');
  useEffect(() => {
    if (!loading) {
      setButtonText('REVEAL');
    } else if (event?.status === EventStatus.Creating) {
      setButtonText('PROVING');
    } else if (event?.status === EventStatus.Pending) {
      setButtonText('PENDING');
    }
  }, [loading, event?.status]);

  const disabled =
    !inputs?.reveal_answer_notification_record ||
    !inputs?.challenger_answer_record ||
    !inputs?.joint_piece_stake ||
    !inputs?.challenger_claim_signature

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <div className='flex flex-col items-center gap-2'>
        <PageHeader bg='bg-primary-blue' text='RESULTS ARE IN' />
      </div>
      {opponent && <Versus versus={opponent} />}
      {wagerAmount && <Wager wagerAmount={wagerAmount} />}
      {answer && (
        <div className='flex flex-col gap-2'>
          <SelectedTreasureLocation answer={answer} win={undefined} />
          <div className='self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight text-primary-green'>
            You hid the booty {answer}!
          </div>
        </div>
      )}
      <div className='flex flex-grow flex-col' />
      {error && <p className='break-words'>Error {error}</p>}
      <Button
        onClick={createEvent}
        disabled={disabled || loading}
        variant='primary'
      >
        {buttonText}
        {loading && <LoadingEllipses/>}
      </Button>
    </div>
  );
};

export default Reveal;
