/* eslint-disable @typescript-eslint/no-explicit-any */
import Versus from '@components/Versus.js';
import PageHeader from '@components/PageHeader.js';
import Wager from '@components/Wager.js';
import SelectedTreasureLocation from '@components/SelectedTreasureLocation.js';
import Button from '@components/Button.js';
import {
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  ProposeGameInputs,
  transitionFees,
} from '@state/manager.js';
import { Answer } from '@state/RecordTypes/treasure_hunt_vxxx.js';
import { useEventHandling } from '@hooks/eventHandling.js';
import {
  createSharedState,
  requestCreateEvent,
  requestSignature,
  useAccount,
  EventType,
  EventStatus,
  useBalance,
} from '@puzzlehq/sdk';
import { useEffect, useState } from 'react';
import jsyaml from 'js-yaml';

import { Step, useNewGameVsPersonStore } from './store.js';
import { useSearchParams } from 'react-router-dom';
import Nav from '@components/Nav.js';

const messageToSign = '1234567field';

enum ConfirmStep {
  Signing,
  RequestingEvent,
}

function ConfirmStartGame() {
  const [inputs, eventId, setInputs, setEventId, setStep] = useNewGameVsPersonStore(
    (state) => [
      state.inputs,
      state.eventId,
      state.setInputs,
      state.setEventId,
      state.setStep,
    ]
  );
  const [confirmStep, setConfirmStep] = useState(ConfirmStep.Signing);

  const opponent = inputs?.opponent ?? '';
  const answer = inputs?.challenger_answer;
  const amount = inputs?.challenger_wager_amount ?? 0;

  const { account } = useAccount();
  const { balances } = useBalance({});
  const balance = balances?.[0]?.public ?? 0;

  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventId,
    stepName: 'Confirm Start',
    onSettled: () => setStep(Step._05_GameStarted),
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (event) {
      setConfirmStep(ConfirmStep.Signing);
    }
  }, [event]);

  const createProposeGameEvent = async () => {
    setLoading(true);
    setConfirmStep(ConfirmStep.Signing);
    setError(undefined);
    const signature = await requestSignature({ message: messageToSign });

    if (signature.error || (!signature.messageFields || !signature.signature)) {
      setError(signature.error);
      setLoading(false);
      return;
    }
    const sharedStateResponse = await createSharedState();
    if (sharedStateResponse.error) {
      setError(sharedStateResponse.error);
      setLoading(false);
      return;
    } else if (sharedStateResponse.data) {
      const game_multisig_seed = sharedStateResponse.data.seed;
      const game_multisig = sharedStateResponse.data.address;

      if (
        inputs?.opponent &&
        inputs?.wager_record &&
        inputs?.challenger_wager_amount &&
        inputs?.challenger_answer &&
        inputs?.challenger &&
        signature &&
        signature.messageFields &&
        signature.signature &&
        account
      ) {
        setConfirmStep(ConfirmStep.RequestingEvent);

        const fields = Object(jsyaml.load(signature.messageFields));

        const proposalInputs: ProposeGameInputs = {
          wager_record: inputs.wager_record,
          challenger_wager_amount: inputs.challenger_wager_amount + 'u64',
          sender: inputs.challenger,
          challenger: inputs.challenger,
          opponent: inputs.opponent,
          game_multisig: game_multisig,
          challenger_message_1: fields.field_1,
          challenger_message_2: fields.field_2,
          challenger_message_3: fields.field_3,
          challenger_message_4: fields.field_4,
          challenger_message_5: fields.field_5,
          challenger_sig: signature.signature,
          challenger_nonce: messageToSign, /// todo - make this random
          challenger_answer:
            inputs.challenger_answer === Answer.left
              ? '0field'
              : '1field',
          game_multisig_seed,
        };
        const response = await requestCreateEvent({
          type: EventType.Execute,
          programId: GAME_PROGRAM_ID,
          functionId: GAME_FUNCTIONS.propose_game,
          fee: transitionFees.propose_game,
          inputs: Object.values(proposalInputs),
        });
        if (response.error) {
          setError(response.error);
        } else if (!response.eventId) {
          setError('No eventId found!');
        } else {
          console.log('success', response.eventId);
          setEventId(response.eventId);
          setSearchParams({ eventId: response.eventId });
        }
      }
    }
  };

  const disabled = [
    inputs?.opponent,
    inputs?.wager_record,
    inputs?.challenger_wager_amount,
    inputs?.challenger_answer,
    balance === 0
  ].includes(undefined);

  const [buttonText, setButtonText] = useState('PROPOSE GAME');

  useEffect(() => {
    if (!loading) {
      setButtonText('PROPOSE GAME');
    } else if (event?.status === EventStatus.Creating) {
      setButtonText('CREATING...');
    } else if (event?.status === EventStatus.Pending) {
      setButtonText('PENDING...');
    } else if (confirmStep === ConfirmStep.Signing) {
      setButtonText('SIGNING...');
    } else if (confirmStep === ConfirmStep.RequestingEvent) {
      setButtonText('REQUESTING...');
    }
  }, [loading, event?.status, confirmStep]);

  return (
    <div className='flex h-full w-full flex-col justify-center gap-2'>
      <Nav step={3} totalSteps={5}/>
      <PageHeader bg='bg-primary-pink' text='REVIEW AND KICKOFF GAME' />
      <Versus versus={opponent} />
      <Wager wagerAmount={Number(amount)} />
      {answer && (
        <div className='flex flex-col gap-2'>
          <SelectedTreasureLocation answer={answer as Answer} win={undefined} />
          <div className='self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight text-primary-green '>
            You are hiding the treasure {answer}!
          </div>
        </div>
      )}
      <div className='flex flex-grow flex-col' />
      {error && <p>Error: {error}</p>}
      <div className='flex gap-4'>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._03_StartWager)}
          disabled={loading}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          onClick={createProposeGameEvent}
          variant='primary'
          disabled={disabled || loading}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmStartGame;
