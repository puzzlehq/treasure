export type NavDotsProps = {
  step: number;
  totalSteps: number;
};

function NavDots({ step, totalSteps }: NavDotsProps) {
  return (
    <nav className='flex justify-center gap-3'>
      {Array.from({ length: totalSteps }).map((_, ix) => (
        <div
          key={ix}
          className={`h-3 w-6 rounded-full bg-primary ${
            ix > step ? 'opacity-40' : ''
          }`}
        ></div>
      ))}
    </nav>
  );
}

export default NavDots;
