import Header from "./-header";
import { Step, useAleoIntroStore } from './store';
import Button from '@components/Button';
import { BiStar } from 'react-icons/bi';

const Unlocked = () => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);

  return (
    <>
      <Header step={3} />
      <div className='w-[50px] h-[50px] bg-bg2 rounded-full items-center align-middle'>
        <BiStar size={24} />
      </div>
      <p className='font-heading text-4xl'>Win rewards for playing</p>
      <p>Puzzle is the first Aleo wallet to let you earn rewards on Aleo. Puzzle pieces are rewards that can be redeemed for prizes (coming soon). </p>
      <div className='flex w-full gap-4'>
        <Button
          fullWidth
          onClick={() => setStep(Step._03_Verified)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          fullWidth
          onClick={() => setStep(Step._05_Conclusion)}
          variant='primary'
        >
          NEXT
        </Button>
      </div>
    </>
  )
}

export default Unlocked