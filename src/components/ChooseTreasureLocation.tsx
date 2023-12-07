import treasure_closed from '../assets/treasure_closed.png';
import { Answer } from '@state/RecordTypes/treasure_hunt_vxxx';

type HideTreasureProps = {
  setAnswer: (answer: Answer) => void;
  answer?: Answer;
  hiding: boolean; // are we the treasure? or finding it?
  disabled?: boolean;
};

function ChooseTreasureLocation({ setAnswer, answer, hiding, disabled = false }: HideTreasureProps) {
  return (
    <section className='mt-4 flex max-w-full flex-col gap-4'>
      <div className='flex gap-5'>
        <TreasureButton
          imgSrc={treasure_closed}
          text='Left'
          onClick={() => setAnswer && setAnswer(Answer.left)}
          selected={answer ? answer === Answer.left : undefined}
          disabled={disabled}
        />
        <TreasureButton
          imgSrc={treasure_closed}
          text='Right'
          onClick={() => setAnswer && setAnswer(Answer.right)}
          selected={answer ? answer === Answer.right : undefined}
          disabled={disabled}
        />
      </div>
      <p className='self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight text-primary-green'>
        {((): string => {
          if (answer === undefined && hiding) {
            return 'Choose where to hide the booty';
          } else if (answer === undefined && !hiding) {
            return 'Choose where you think the booty is';
          } if (hiding) {
            return `You chose to hide the booty ${answer}`;
          } else {
            return `You think the booty is ${answer}`;
          }
        })()}
      </p>
    </section>
  );
}

type TreasureButtonProps = {
  imgSrc: string;
  text: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const TreasureButton = ({
  imgSrc,
  text,
  selected,
  disabled = false,
  onClick,
}: TreasureButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`group flex flex-col self-center rounded-lg outline-primary hover:outline ${
        selected ? 'outline' : ''
      } flex w-[150px] flex-col items-center gap-2 p-4 hover:opacity-100 disabled:opacity-40`}
    >
      <img
        loading='lazy'
        src={imgSrc}
        className={`aspect-square h-[100px] w-[100px] object-fit object-center ${
          selected || selected === undefined ? '' : 'opacity-40'
        }`}
        alt={text}
      />
      <div
        className={`mt-2.5 whitespace-nowrap text-center text-sm font-extrabold ${
          selected
            ? 'text-primary'
            : selected === false
            ? 'text-primary-white opacity-40 group-hover:text-primary'
            : 'text-primary-white'
        }`}
      >
        {text}
      </div>
    </button>
  );
};

export default ChooseTreasureLocation;

