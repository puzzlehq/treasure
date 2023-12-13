import Header from "./-header";
import { Step, useAleoIntroStore } from './store';
import Button from '@components/Button';
import { BiLock } from 'react-icons/bi';

const HiddenTreasure = () => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);

  return (
    <>
      <Header step={1} />
      <div className='w-[50px] h-[50px] bg-bg2 rounded-full align-middle flex justify-center items-center'>
        <BiLock size={24} />
      </div>
      <p className='font-header text-4xl text-center'>Hidden treasure</p>
      <p>The game is built on Aleo’s privacy-enabled blockchain, so there’s no way for you to know where we hid the treasure.</p>
      <div className='flex w-full gap-4'>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._01_HiddenInformation)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._03_Verified)}
          variant='primary'
        >
          NEXT
        </Button>
      </div>
    </>
  )
}

export default HiddenTreasure