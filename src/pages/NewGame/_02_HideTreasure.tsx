/* eslint-disable @typescript-eslint/no-explicit-any */
import Nav from '@components/Nav';
import ChooseTreasureLocation from '@components/ChooseTreasureLocation';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import { Answer } from '@state/RecordTypes/wheres_alex_vxxx';
import { Step, useNewGameStore } from './store';

function HideTreasure() {
  const [inputs, setInputs, setStep] = useNewGameStore((state) => [
    state.inputs,
    state.setInputs,
    state.setStep,
  ]);

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex h-full w-full flex-col items-center gap-2 px-5'>
        <Nav step={1} totalSteps={5}/>
        <PageHeader
          text='WHERE WOULD YOU LIKE TO HIDE THE TREASURE?'
          bg='bg-primary-blue'
        />
        <ChooseTreasureLocation
          setAnswer={(challenger_answer: Answer) =>
            setInputs({ ...inputs, challenger_answer })
          }
          answer={inputs?.challenger_answer as Answer}
          hiding={true}
        />
        <div className='flex flex-grow flex-col' />
        <div className='flex w-full gap-4'>
          <Button
            fullWidth
            onClick={() => setStep(Step._01_NewGame)}
            variant='tertiary'
          >
            BACK
          </Button>
          <Button
            fullWidth
            onClick={() => setStep(Step._03_StartWager)}
            disabled={!inputs || !inputs.challenger_answer}
            color='green'
          >
            NEXT
          </Button>
        </div>

      </div>
    </div>
  );
}

export default HideTreasure;
