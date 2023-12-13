import leo from '@assets/leo.png'
import treasure_closed from '@assets/treasure_closed.png'
import treasure_open_full from '@assets/treasure_open_full.png'
import Header from "./-header";
import { Step, useGameIntroStore } from './store';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

const Conclusion = () => {
  const [close, setStep] = useGameIntroStore((state) => [state.close, state.setStep]);
  const navigate = useNavigate();

  return (
    <>
      <Header step={4} text='How the game works'/>
      <div className="flex flex-col align-middle gap-8">
        <div className='flex w-full gap-4 items-center'>
          <img
            src={leo}
            className='w-[85px] sm:w-[115px]'
            alt='Leo the pirate'
          />
          <div className='flex gap-2'>
            <p className='font-header text-4xl'>1.</p>
            <p>Leo the Pirate hid 10 puzzle pieces in one of these two treasure chests.</p>
          </div>
        </div>
        <div className='flex flex-col gap-2 items-center'>
          <div className='flex self-center gap-4'>
            <img
              src={treasure_closed}
              className='w-[85px] sm:w-[115px]'
              alt='Left closed treasure'
            />
            <img
              src={treasure_closed}
              className='w-[85px] sm:w-[115px]'
              alt='Right closed treasure'
            />
          </div>
          <div className='flex gap-2'>
            <p className='font-header text-4xl'>2.</p>
            <p>Guess which chest Leo hid the puzzle pieces in</p>
          </div>
        </div>
        <div className='flex flex-col gap-4 items-center justify-center'>
          <div className='flex w-full gap-4'>
            <img
              src={treasure_open_full}
              className='w-[85px] sm:w-[115px] object-scale-down'
              alt='Open treasure with booty'
            />
            <div className='flex gap-2'>
              <p className='font-header text-4xl'>3.</p>
              <p>Pick the correct chest and loot Leo's puzzle pieces. Pick the wrong chest, and he'll loot your booty!</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full gap-4'>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._04_Unlocked)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          onClick={() => {
            navigate('/');
            close();
          }}
          variant='primary'
        >
          NEXT
        </Button>
      </div>
    </>
  )
}

export default Conclusion;