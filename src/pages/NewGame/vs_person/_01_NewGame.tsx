/* eslint-disable @typescript-eslint/no-explicit-any */
import Nav from '@components/Nav';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import { useAccount } from '@puzzlehq/sdk';
import { aleoAddressRegex } from '../../../utils.js';
import { Step, useNewGameStore } from '../vs_person/store.js';
import { useNavigate } from 'react-router-dom';

function NewGame() {
  const [inputs, setInputs, setStep] = useNewGameStore((state) => [
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
        text='WHO WOULD YOU LIKE TO CHALLENGE?'
        bg='bg-primary-blue'
      />
      <input
        type='text'
        className='mt-5 w-full rounded-lg border-[3px] border-solid border-bg2 bg-transparent p-4 text-sm font-semibold leading-4 max-md:mr-px focus:outline-none focus:border-primary'
        placeholder="Enter Opponent's Address"
        id='opponent'
        value={opponent ?? ''}
        onChange={(e) => {
          setInputs({ ...inputs, opponent: e.target.value });
        }}
      />
      <div className='flex flex-grow flex-col' />
      <div className='flex w-full gap-4'>
        <Button
          fullWidth
          onClick={() => navigate('/')}
          variant='tertiary'
        >
          HOME
        </Button>
        <Button
          fullWidth
          onClick={() => setStep(Step._02_HideAlex)}
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
