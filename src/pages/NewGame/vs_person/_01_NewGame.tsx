/* eslint-disable @typescript-eslint/no-explicit-any */
import Nav from '@components/Nav';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import { useAccount } from '@puzzlehq/sdk';
import { aleoAddressRegex } from '../../../utils.js';
import { Step, useNewGameVsPersonStore } from '../vs_person/store.js';
import { useNavigate } from 'react-router-dom';
import { PasteyQR } from '@components/QR.js';

function NewGame() {
  const [inputs, setInputs, setStep] = useNewGameVsPersonStore((state) => [
    state.inputs,
    state.setInputs,
    state.setStep,
  ]);
  const { account } = useAccount();
  const navigate = useNavigate();

  const opponent = inputs?.opponent;

  return (
    <div className='flex h-full w-full flex-col items-center justify-between gap-2'>
      <Nav step={0} totalSteps={5}/>
      <PageHeader
        text='CHOOSE YOUR OPPONENT'
        bg='bg-primary-blue'
      />
      <div className='flex flex-row gap-2 w-full'>
        <PasteyQR opponent={opponent ?? ''} setOpponent={(address) => setInputs({ ...inputs, opponent: address })} />
      </div>
      <div className='flex flex-grow flex-col' />
      <div className='flex w-full gap-4'>
        <Button
          className='w-1/2'
          onClick={() => navigate('/new-game')}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._02_HideBooty)}
          variant='primary'
          disabled={
            !inputs ||
            !account ||
            !aleoAddressRegex.test(inputs.opponent ?? '') ||
            inputs.opponent === account.address
          }
        >
          NEXT
        </Button>
      </div>

    </div>
  );
}

export default NewGame;
