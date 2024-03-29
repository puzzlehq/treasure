import scene_12 from '@assets/12.png'
import Header from "./-header";
import { Step, useGameIntroStore } from './store';
import Button from '@components/Button';

const ChestInfo = () => {
  const [setStep] = useGameIntroStore((state) => [state.setStep]);

  return (
    <>
      <Header step={1} text='How the magic treasure chest works'/>
      <div className="flex flex-col flex-grow align-middle items-center">
        <div className='rounded-lg bg-bg2 max-w-[300px] p-5'>
          You can open the chest if you put enough puzzle pieces in it.
        </div>
        <img
          src={scene_12}
          alt='Multiparty computation treasure chest'
          className='-mt-4'
        />
      </div>
      <div className='flex w-full gap-4'>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._01_GameParts)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          className='w-1/2'
          onClick={() => setStep(Step._03_Locked)}
          variant='primary'
        >
          NEXT
        </Button>
      </div>
    </>
  )
}

export default ChestInfo;