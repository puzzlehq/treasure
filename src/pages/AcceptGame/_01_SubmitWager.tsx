import Wager from '@components/Wager';
import PageHeader from '@components/PageHeader';
import Versus from '@components/Versus';
import Button from '@components/Button';
import NavDots from '@components/Nav';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  EventStatus,
  EventType,
  importSharedState,
  requestCreateEvent,
  requestSignature,
} from '@puzzlehq/sdk-react';
import {
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  SubmitWagerInputs,
  transitionFees,
} from '@state/manager';
import { Step, useAcceptGameStore } from './store';
import { useGameStore } from '@state/gameStore';
import jsyaml from 'js-yaml';
import { useEventHandling } from '@hooks/eventHandling';
import LoadingEllipses from '@components/LoadingEllipses';
import { mediaQuery } from '../../main';
import { toast } from 'react-hot-toast';

const messageToSign = '1234567field';

enum ConfirmStep {
  Signing,
  Multisig,
  RequestingEvent,
}

const SubmitWager = () => {
  const [
    inputs,
    eventIdSubmit,
    setSubmitWagerInputs,
    setEventIdSubmit,
    setStep,
  ] = useAcceptGameStore((state) => [
    state.inputsSubmitWager,
    state.eventIdSubmit,
    state.setSubmitWagerInputs,
    state.setEventIdSubmit,
    state.setStep,
  ]);
  const [currentGame, largestPiece] = useGameStore((state) => [
    state.currentGame,
    state.largestPiece,
  ]);
  const [confirmStep, setConfirmStep] = useState(ConfirmStep.Signing);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventIdSubmit,
    stepName: 'Submit Wager',
    onSettled: () => setStep(Step._02_AcceptGame),
  });

  const createEvent = async () => {
    if (
      !inputs?.opponent_wager_record ||
      !inputs.key_record ||
      !inputs.game_req_notification
    )
      return;
    setLoading(true);
    setError(undefined);
    setConfirmStep(ConfirmStep.Signing);
    const signaturePromise = requestSignature({ message: messageToSign });
    const signatureToastMessage = mediaQuery.matches ? 'Open Puzzle Wallet to sign' : 'Sign the message';
    toast.promise(signaturePromise, {
      loading: signatureToastMessage,
      success: 'Message signed!',
      error: (e) => e
    })

    const signature = await signaturePromise;
    
    if (!signature.messageFields || !signature.signature) {
      setError('Signature or signature message fields not found');
      setLoading(false);
      return;
    }
    setConfirmStep(ConfirmStep.RequestingEvent);
    const messageFields = Object(jsyaml.load(signature.messageFields));

    const newInputs: Partial<SubmitWagerInputs> = {
      opponent_wager_record: inputs.opponent_wager_record,
      key_record: inputs.key_record,
      game_req_notification: inputs.game_req_notification,
      opponent_message_1: messageFields.field_1,
      opponent_message_2: messageFields.field_2,
      opponent_message_3: messageFields.field_3,
      opponent_message_4: messageFields.field_4,
      opponent_message_5: messageFields.field_5,
      opponent_sig: signature.signature,
    };
    const game_multisig_seed = inputs.key_record.data.seed ?? '';
    console.log('game_multisig seed', game_multisig_seed);
    setConfirmStep(ConfirmStep.Multisig);
    const { data } = await importSharedState(game_multisig_seed);
    console.log(`Shared state imported: ${data?.address}`);

    setSubmitWagerInputs(newInputs);
    const createEventPromise = requestCreateEvent({
      type: EventType.Execute,
      programId: GAME_PROGRAM_ID,
      functionId: GAME_FUNCTIONS.submit_wager,
      fee: transitionFees.submit_wager,
      inputs: Object.values(newInputs),
      address: inputs.game_req_notification.owner, // opponent address
    });
    const createEventMessage = mediaQuery.matches ? 'Open Puzzle Wallet to accept' : 'Accept the request';
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
      /// todo - other things here?
      setEventIdSubmit(response.eventId);
      setSubmitWagerInputs({ ...newInputs });
      setSearchParams({ eventIdSubmit: response.eventId });
    }
  };

  const opponent = currentGame?.gameNotification.recordData.challenger_address;
  const wager = (currentGame?.gameNotification.recordData.total_pot ?? 0) / 2;
  const opponent_wager_record = largestPiece;

  const disabled = !opponent || !wager || !opponent_wager_record || !inputs;

  const [buttonText, setButtonText] = useState('SUBMIT');

  useEffect(() => {
    if (!loading) {
      setButtonText('SUBMIT');
    } else if (event?.status === EventStatus.Creating) {
      setButtonText('PROVING');
    } else if (event?.status === EventStatus.Pending) {
      setButtonText('PENDING');
    } else if (confirmStep === ConfirmStep.Signing) {
      setButtonText('SIGNING');
    } else if (confirmStep === ConfirmStep.Multisig) {
      setButtonText('IMPORTING MS');
    } else if (confirmStep === ConfirmStep.RequestingEvent) {
      setButtonText('REQUESTING');
    }
  }, [loading, event?.status, confirmStep]);

  return (
    <div className='flex h-full w-full flex-col justify-center gap-2'>
      <div className='flex w-full flex-col gap-2'>
        <NavDots step={0} totalSteps={3}/>
        <PageHeader bg='bg-primary-pink' text={`YOU'VE BEEN CHALLENGED!`} />
      </div>
      {opponent && <Versus versus={opponent} isChallenger={false} />}
      <Wager wagerAmount={Number(wager)} />
      <div className='flex flex-grow flex-col' />
      {error && <p className='break-words'>Error: {error}</p>}
      <div className='flex w-full gap-4'>
        <Button
          variant='tertiary'
          className='w-1/2'
          disabled={loading}
          onClick={() => {
            navigate('/');
          }}
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          variant='primary'
          disabled={disabled || loading}
          onClick={createEvent}
        >
          {buttonText}
          {loading && <LoadingEllipses/>}
        </Button>

      </div>
    </div>
  );
};

export default SubmitWager;
