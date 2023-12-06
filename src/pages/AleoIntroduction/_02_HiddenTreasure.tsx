import Header from "./-header";
import { Step, useAleoIntroStore } from './store';
import Button from '@components/Button';
import { BiLock } from 'react-icons/bi';

const HiddenTreasure = () => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);

  return (
    <>
      <Header step={1} />
      <div className='w-[50px] h-[50px] bg-bg2 rounded-full items-center align-middle'>
        <BiLock size={24} />
      </div>
      <p className='font-heading text-4xl'>Hidden treasure</p>
      <p>The game is built on Aleo’s privacy-enabled blockchain, so there’s no way for you to know where we hid the treasure.</p>
      <div className='flex w-full gap-4'>
        <Button
          fullWidth
          onClick={() => setStep(Step._01_HiddenInformation)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          fullWidth
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