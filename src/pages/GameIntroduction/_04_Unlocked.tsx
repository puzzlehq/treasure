import scene_14 from '@assets/14.png'
import Header from "./-header";
import { Step, useGameIntroStore } from './store';
import Button from '@components/Button';

const Unlocked = () => {
  const [setStep] = useGameIntroStore((state) => [state.setStep]);

  return (
    <>
      <Header step={3} text='How the magic treasure chest works'/>
      <div className="flex flex-col flex-grow align-middle items-center">
        <div className='rounded-lg bg-bg2 max-w-[300px] p-5'>
          If someone with the master puzzle key (like Leo the Pirate) comes in, they can loot your lost puzzle pieces!
        </div>
        <img
          src={scene_14}
          alt='Multiparty computation treasure chest'
          className='-mt-4'
        />
      </div>
      <div className='flex w-full gap-4'>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._03_Locked)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
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