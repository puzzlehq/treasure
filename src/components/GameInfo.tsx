import treasure from '../assets/treasure_open_full.png';

function GameInfo(props: {
  multisig?: string;
  transactionId?: string;
  title: 'GAME BEGUN!' | 'GAME ACCEPTED!' | 'ANSWER REVEALED!';
}) {
  return (
    <section className='mb-24 mt-24 flex grow flex-col items-center gap-2 self-stretch max-md:mt-10'>
      <img
        src={treasure}
        className='z-0 h-full max-h-[5rem] max-w-[50%] object-contain'
        alt='treasure (booty)'
      />
      <div className='flex w-full flex-col items-center justify-center self-stretch rounded-lg border-[5px] border-bg2 bg-bg1 px-5 py-1.5'>
        <h1 className='text-primary-black mt-1.5 max-w-[295px] self-center break-words text-center text-base font-extrabold leading-4'>
          {props.title}
        </h1>
        {props.multisig &&
          <p className='mt-1.5 max-w-[295px] self-center break-words text-center text-base font-extrabold leading-4 text-primary-black'>
            GAME ID: {props.multisig}
          </p>
        }
        {props.transactionId &&
          <p className='mt-1.5 max-w-[295px] self-center break-words text-center text-base font-extrabold leading-4 text-primary-black'>
            Aleo Transaction ID: {props.transactionId}
          </p>
        }
      </div>
    </section>
  );
}

export default GameInfo;
