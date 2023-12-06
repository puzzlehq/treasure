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
          className={`h-3 w-3 rounded-full  ${
            ix > step ? 'bg-primary-light' : 'bg-primary'
          }`}
        ></div>
      ))}
    </nav>
  );
}

export default NavDots;
