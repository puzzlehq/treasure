type PageHeaderProps = {
  text: string;
  bg: string;
};

function PageHeader({ text, bg }: PageHeaderProps) {
  return (
    <section
      className={`flex w-full flex-col items-center justify-center self-stretch p-4 max-md:mr-px ${bg} rounded-xl`}
    >
      <h1 className='text-white max-w-[330px] self-center text-center text-5xl font-extrabold leading-10'>
        {text}
      </h1>
    </section>
  );
}

export default PageHeader;
