import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Info = () => {
  const navigate = useNavigate();

  return (
    <section className='flex grow flex-col rounded-b-[10px] rounded-tr-[10px] border-2 border-solid border-bg2 bg-bg1 pb-6'>
      <div className='flex max-w-full flex-col self-start bg-bg2 px-5 py-2'>
        <div className='self-center whitespace-nowrap text-left text-xs font-extrabold leading-3'>
          LEARN MORE
        </div>
      </div>
      <div className='flex flex-col px-5 pt-2 gap-4'>
        <Button
          fullWidth
          variant='gray'
          size='md'
          onClick={() => navigate('/game-info')}
        >
          How the Game Works
        </Button>
        <Button
          fullWidth
          variant='gray'
          size='md'
          onClick={() => navigate('/aleo-info')}
        >
          Gaming on Aleo
        </Button>
      </div>
    </section>
  )
}

export default Info;