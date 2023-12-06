import scene_13 from '@assets/13treasure.svg'
import { Box } from "@components/Box";
import Header from "./-header";
import { Step, useGameIntroStore } from './store';
import Button from '@components/Button';

const Locked = () => {
  const [setStep] = useGameIntroStore((state) => [state.setStep]);

  return (
    <Box>
      <Header step={2} />
      <p className='self-center opacity-60'>How the magic treasure chest works</p>
      <div className="flex flex-col flex-grow align-middle">
        <div className='rounded-lg bg-bg2 max-w-[300px] p-5'>
          If you don't put enough puzzle pieces in the chest, you can't open it and lose them.
        </div>
        <img
          src={scene_13}
          alt='Locked Multiparty computation treasure chest'
          className='-mt-4'
        />
      </div>
      <div className='flex w-full gap-4'>
        <Button
          fullWidth
          onClick={() => setStep(Step._02_ChestInfo)}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          fullWidth
          onClick={() => setStep(Step._04_Unlocked)}
          color='green'
        >
          NEXT
        </Button>
      </div>
    </Box>
  )
}

export default Locked