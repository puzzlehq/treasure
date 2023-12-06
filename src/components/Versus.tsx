type VersusProps = {
  versus: string;
  isChallenger?: boolean;
};

function Versus({ versus, isChallenger = true }: VersusProps) {
  // Shorten the opponent string
  const displayOpponent =
    versus.length > 9 ? versus.slice(0, 5) + '...' + versus.slice(-4) : versus;

  return (
    <div className='mt-5 self-center whitespace-nowrap text-center text-xs font-bold text-white'>
      {isChallenger && 'You are challenging'}
      <div className='w-[155px] max-w-full self-center whitespace-nowrap rounded-[200px] border-2 border-solid border-[color:var(--White,#FCFCFC)] bg-zinc-50 px-4 py-2 text-center text-lg font-bold text-bg2'>
        {displayOpponent}
      </div>
      {!isChallenger && 'is challenging you'}
      to find where you hid the treasure!
    </div>
  );
}

export default Versus;
