import leo from '@assets/leo.png';
import puzzle_coin from '@assets/puzzle_coin.png'
import treasure_closed from '@assets/treasure_closed.png'
import { Box } from "@components/Box";
import Header from "./-header";
import { Step, useGameIntroStore } from './store';
import Button from '@components/Button';

const GameParts = () => {
  const [setStep] = useGameIntroStore((state) => [state.setStep]);

  return (
    <Box>
      <Header step={0} />
      <div className="grid grid-rows-3 gap-2 md:gap-4 w-full items-center grid-cols-[1fr_65px] sm:grid-cols-[1fr_115px]">
        <div className="col-start-1 col-span-1 flex flex-col gap-1">
          <p className="font-header text-4xl">Leo the Pirate</p>
          <p className="font-body text-base">Aleo's Leo the Lion is now a pirate — and a bot! — to challenge you to find the treasure.</p>
        </div>
        <div className="col-start-2 col-span-1 w-auto">
          <img
            src={leo}
            alt='Leo the Pirate'
            className='w-full h-full object-contain'
          />
        </div>

        <div className="col-start-1 col-span-1">
          <div className="col-start-1 col-span-1 flex flex-col gap-1">
            <p className="font-header text-4xl">Puzzle pieces</p>
            <p className="font-body text-base">Puzzle Pieces are what you use to wager and play the game. Collect as many as you can!</p>
          </div>
        </div>
        <div className="col-start-2 col-span-1 w-auto">
          <img
            src={puzzle_coin}
            alt='Puzzle Pieces'
            className='w-full h-full object-contain'
            />
        </div>

        <div className="col-start-1 col-span-1">
          <div className="col-start-1 col-span-1 flex flex-col gap-1">
            <p className="font-header text-4xl">Treasure Chest</p>
            <p className="font-body text-base">A magic safe that requires puzzle pieces or a master key to open.</p>
          </div>
        </div>
        <div className="col-start-2 col-span-1 w-auto">
          <img
            src={treasure_closed}
            alt='Closed Treasure Chest'
            className='w-full h-full object-contain'
            />
        </div>
      </div>
      <div className='flex w-full gap-4'>
        <Button
          fullWidth
          onClick={() => setStep(Step._02_ChestInfo)}
          color='green'
        >
          NEXT
        </Button>
      </div>
    </Box>
  )
}

export default GameParts