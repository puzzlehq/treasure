import { shortenAddress } from "@puzzlehq/sdk";

type VersusProps = {
  versus: string;
  isChallenger?: boolean;
};

function Versus({ versus, isChallenger = true }: VersusProps) {
  // Shorten the opponent string
  const displayOpponent =
    shortenAddress(versus)

  return (
    <div className='flex flex-col self-center text-center text-md font-bold text-white items-center gap-1'>
      {isChallenger && 'You are challenging'}
      <div className='w-[225px] max-w-full whitespace-nowrap rounded-[200px] border-4 border-solid border-bg2 bg-zinc-50 px-4 py-2 text-center text-lg font-bold text-bg2'>
        {displayOpponent}
      </div>
      {!isChallenger && 'is challenging you '}
      to find where you hid the treasure!
    </div>
  );
}

export default Versus;
