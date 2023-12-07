import treasure_open_empty from '../assets/treasure_open_empty.png';
import treasure_open_full from '../assets/treasure_open_full.png';
import treasure_closed from '../assets/treasure_closed.png';
import { Answer } from '@state/RecordTypes/treasure_hunt_vxxx.js';

type SelectedTreasureLocationProps = {
  answer: Answer;
  win?: boolean;
};

function SelectedTreasureLocation({ answer, win }: SelectedTreasureLocationProps) {
  const Treasure = ({ side }: { side: Answer }) => {
    const isSelected = answer === side;
    return (
      <div className='flex w-1/2 flex-col gap-2 self-start'>
        <img
          loading='lazy'
          src={win === undefined ? treasure_closed : win === true ? treasure_open_full : treasure_open_empty}
          className={`aspect-square w-full self-stretch overflow-hidden object-fit object-center
                      ${isSelected ? '' : 'opacity-40'}`}
          alt={side}
        />
        {win === undefined && (
          <div
            className={`self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight
                        ${isSelected ? '' : 'opacity-40'}
                        ${isSelected ? 'text-primary-green' : 'text-primary-white'}`}
          >
            {side}
          </div>
        )}
      </div>
    );
  };

  const ResultText = ({ result }: { result: 'WON' | 'LOST' }) => {
    return (
      <div className='z-10 w-1/2'>
        <p className={`text-center text-6xl font-black text-primary-${result === 'WON' ? 'green' : 'red'}`}>
          YOU
          <br />
          {result}!
        </p>
      </div>
    );
  };

  return (
    <div className='flex w-full flex-col items-center gap-8'>
      <div className='flex w-[298px] max-w-full items-center justify-between gap-5 self-center'>
        {win === undefined ? (
          <>
            <Treasure side={Answer.left} />
            <Treasure side={Answer.right} />
          </>
        ) : (
          <>
            {win && <Treasure side={answer} />}
            <ResultText result={win ? 'WON' : 'LOST'} />
            {!win && <Treasure side={answer} />}
          </>
        )}
      </div>
    </div>
  );
}

export default SelectedTreasureLocation