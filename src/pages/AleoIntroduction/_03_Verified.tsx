import { BiListCheck } from "react-icons/bi";
import Header from "./-header";
import { Step, useAleoIntroStore } from './store';
import Button from '@components/Button';

const Verified = () => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);

  return (
    <>
      <Header step={2} />
      <div className='w-[50px] h-[50px] bg-bg2 rounded-full align-middle flex justify-center items-center'>
        <BiListCheck size={24} />
      </div>
      <p className='font-header text-4xl text-center'>Verified with ZKPs</p>
      <p>Even though you don't know where the treasure is hidden, you can trust the game is not changing the hiding location based on your guess. Aleo verified the hiding with zero-knowledge proofs on chain.</p>
      <div className='flex w-full gap-4'>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._02_HiddenTreasure)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._04_Rewards)}
          variant='primary'
        >
          NEXT
        </Button>
      </div>
    </>
  )
}

export default Verified