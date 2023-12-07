/* eslint-disable @typescript-eslint/no-explicit-any */
import PageHeader from '@components/PageHeader';
import NavDots from '@components/Nav';
import ChooseTreasureLocation from '@components/ChooseTreasureLocation.js';
import Button from '@components/Button';
import {
  requestCreateEvent,
  EventType,
  EventStatus,
  useBalance,
  shortenAddress,
} from '@puzzlehq/sdk';
import {
  AcceptGameInputs,
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  transitionFees,
} from '@state/manager.js';
import { useEffect, useState } from 'react';
import { Answer } from '@state/RecordTypes/treasure_hunt_vxxx.js';
import { Step, useAcceptGameStore } from './store.js';
import { useGameStore } from '@state/gameStore.js';
import { useMsRecords } from '@hooks/msRecords.js';
import { useEventHandling } from '@hooks/eventHandling.js';
import { useSearchParams } from 'react-router-dom';

function AcceptGame() {
  const [
    inputs,
    eventIdAccept,
    eventIdFund,
    setInputs,
    setEventIdAccept,
    setEventIdFund,
    initializeAcceptGame,
    setStep,
  ] = useAcceptGameStore((state) => [
    state.inputsAcceptGame,
    state.eventIdAccept,
    state.eventIdFund,
    state.setAcceptGameInputs,
    state.setEventIdAccept,
    state.setEventIdFund,
    state.initializeAcceptGame,
    state.setStep,
  ]);
  const [currentGame] = useGameStore((state) => [state.currentGame]);

  const msAddress = currentGame?.gameNotification.recordData.game_multisig;
  const msRecords = useMsRecords(msAddress);

  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventIdAccept,
    address: msAddress,
    multisig: true,
    stepName: 'Accept Game',
    onSettled: () => setStep(Step._03_Confirmed),
  });

  const { loading: fundingLoading, event: fundingEvent, setLoading: setFundingLoading, setError: setFundingError } = useEventHandling({
    id: eventIdFund,
    stepName: 'Funding Multisig'
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const { balances: msBalances } = useBalance({
    address: msAddress,
    multisig: true,
  });
  const msPublicBalance =
    msBalances && msBalances?.length > 0 ? msBalances[0].public : 0;
  
  const { balances } = useBalance({});
  const publicBalance =
    balances && balances?.length > 0 ? balances[0].public : 0;
  const amountToFundMs = (transitionFees.accept_game + transitionFees.finish_game - msPublicBalance);

  useEffect(() => {
    if (!currentGame || !msRecords) return;
    const game_record = msRecords?.find(
      (r) => r.data.ix === '16u32.private'
    );
    const piece_stake_challenger = msRecords?.find(
      (r) =>
        r.data.ix === '3u32.private' &&
        r.data.challenger.replace('.private', '') ===
          currentGame.gameNotification.recordData.challenger_address &&
        r.data.staker.replace('.private', '') ===
          currentGame.gameNotification.recordData.challenger_address
    );
    const piece_claim_challenger = msRecords.find(
      (r) =>
        r.data.ix === '6u32.private' &&
        r.data.challenger.replace('.private', '') ===
          currentGame.gameNotification.recordData.challenger_address &&
        r.data.claimer.replace('.private', '') ===
          currentGame.gameNotification.recordData.challenger_address
    );
    const piece_stake_opponent = msRecords.find(
      (r) =>
        r.data.ix === '3u32.private' &&
        r.data.opponent.replace('.private', '') ===
          currentGame.gameNotification.recordData.opponent_address &&
        r.data.staker.replace('.private', '') ===
          currentGame.gameNotification.recordData.opponent_address
    );
    const piece_claim_opponent = msRecords.find(
      (r) =>
        r.data.ix === '6u32.private' &&
        r.data.opponent.replace('.private', '') ===
          currentGame.gameNotification.recordData.opponent_address &&
        r.data.claimer.replace('.private', '') ===
          currentGame.gameNotification.recordData.opponent_address
    );

    console.log('game_record', game_record);
    console.log('piece_stake_challenger', piece_stake_challenger);
    console.log('piece_claim_challenger', piece_claim_challenger);
    console.log('piece_stake_opponent', piece_stake_opponent);
    console.log('piece_claim_opponent', piece_claim_opponent);
    if (
      piece_claim_challenger === undefined ||
      piece_claim_opponent === undefined ||
      piece_stake_challenger === undefined ||
      piece_stake_opponent === undefined ||
      game_record === undefined
    )
      return;
    initializeAcceptGame(
      game_record,
      piece_stake_challenger,
      piece_claim_challenger,
      piece_stake_opponent,
      piece_claim_opponent
    );
  }, [
    currentGame?.gameNotification.recordData.game_multisig,
    msRecords?.toString(),
  ]);

  const createFundEvent = async () => {
    if (amountToFundMs < 0 || !msAddress) return;
    setFundingLoading(true);
    setError(undefined);
    try {
      const response = await requestCreateEvent({
        type: EventType.Send,
        functionId: 'transfer_public',
        programId: 'credits.aleo',
        inputs: [msAddress, (amountToFundMs * 1_000_000).toString() + 'u64'],
        fee: 0.263,
      })
      if (response.error) {
        setFundingError(response.error);
        setFundingLoading(false);
      } else if (response.eventId) {
        setEventIdFund(response.eventId);
        setSearchParams({ ...searchParams, eventIdFund: response.eventId });
      }
    } catch (e) {
      setFundingError((e as Error).message);
      setFundingLoading(false);
    }
  }

  const createAcceptEvent = async () => {
    if (
      !inputs?.game_record ||
      !inputs?.opponent_answer ||
      !inputs.piece_stake_challenger ||
      !inputs.piece_claim_challenger ||
      !inputs.piece_stake_opponent ||
      !inputs.piece_claim_opponent
    )
      return;
    setLoading(true);
    setError(undefined);
    try {
      const response_block_ht = await fetch(
        'https://jigsaw-dev.puzzle.online/api/aleoapi/latest/height'
      );
      const block_ht = Number(await response_block_ht.json());
      const acceptGameInputs: Omit<
        AcceptGameInputs,
        'opponent_answer_readable'
      > = {
        game_record: inputs.game_record,
        opponent_answer: inputs.opponent_answer,
        piece_stake_challenger: inputs.piece_stake_challenger,
        piece_claim_challenger: inputs.piece_claim_challenger,
        piece_stake_opponent: inputs.piece_stake_opponent,
        piece_claim_opponent: inputs.piece_claim_opponent,
        block_ht: block_ht.toString() + 'u32',
      };
      const response = await requestCreateEvent({
        type: EventType.Execute,
        programId: GAME_PROGRAM_ID,
        functionId: GAME_FUNCTIONS.accept_game,
        fee: transitionFees.accept_game,
        inputs: Object.values(acceptGameInputs),
        address: inputs.game_record.owner,
      });
      if (response.error) {
        setError(response.error);
      } else if (!response.eventId) {
        setError('No eventId found!');
      } else {
        console.log('success', response.eventId);
        setEventIdAccept(response.eventId);
        setSearchParams({ ...searchParams, eventIdAccept: response.eventId });
      }
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const answer = inputs?.opponent_answer_readable;

  const disabledFund = amountToFundMs < 0 || (publicBalance < amountToFundMs)

  const disabledAccept =
    !inputs?.game_record ||
    !inputs?.opponent_answer ||
    !inputs.piece_stake_challenger ||
    !inputs.piece_claim_challenger ||
    !inputs.piece_stake_opponent ||
    !inputs.piece_claim_opponent ||
    !answer ||
    msPublicBalance < transitionFees.accept_game + transitionFees.finish_game;

  const [buttonFundText, setButtonFundText] = useState('FUND MULTISIG');
  useEffect(() => {
    if (!fundingLoading) {
      setButtonFundText('FUND MULTISIG');
    } else if (fundingEvent?.status === EventStatus.Creating) {
      setButtonFundText('CREATING...');
    } else if (fundingEvent?.status === EventStatus.Pending) {
      setButtonFundText('PENDING...');
    }
  }, [fundingLoading, fundingEvent?.status]);
  
  const [buttonAcceptText, setButtonAcceptText] = useState('ACCEPT');
  useEffect(() => {
    if (!loading) {
      setButtonAcceptText('ACCEPT');
    } else if (event?.status === EventStatus.Creating) {
      setButtonAcceptText('CREATING...');
    } else if (event?.status === EventStatus.Pending) {
      setButtonAcceptText('PENDING...');
    }
  }, [loading, event?.status]);

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex h-full w-full flex-col items-center gap-6'>
        <div className='flex w-full flex-col gap-2'>
          <NavDots step={1} totalSteps={3} />
          <PageHeader bg='bg-primary-blue' text='SELECT TREASURE CHEST' />
        </div>
        <ChooseTreasureLocation
          setAnswer={(answer) => {
            const newAnswer =
              answer === Answer.left ? '0field' : '1field';
            setInputs({
              ...inputs,
              opponent_answer: newAnswer,
              opponent_answer_readable: answer,
            });
          }}
          answer={answer}
          hiding={false}
          disabled={loading}
        />
        <div className='flex flex-grow flex-col' />
        {error && <p>Error: {error}</p>}
        <div className='flex flex-col items-center text-center'>
        {!loading && (
          <p>
            • Game multisig public balance: {msPublicBalance} public credits
          </p>
        )}
        {!loading &&
          msPublicBalance <
            transitionFees.accept_game + transitionFees.finish_game && (
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col'>
                <p>
                  • {shortenAddress(msAddress ?? '') ?? 'Game multisig'} needs at
                    least {transitionFees.accept_game + transitionFees.finish_game}{' '}
                    public credits!
                </p>
                <p>
                  • Your balance: {publicBalance} public credits
                </p>
              </div>
              <Button
                fullWidth
                onClick={createFundEvent}
                disabled={disabledFund || fundingLoading}
                color='green'
              >
                {buttonFundText}
              </Button>
            </div>
          )
        }
        </div>
        <Button
          fullWidth
          onClick={createAcceptEvent}
          disabled={disabledAccept || loading}
          color='green'
        >
          {buttonAcceptText}
        </Button>
      </div>
    </div>
  );
}

export default AcceptGame;
