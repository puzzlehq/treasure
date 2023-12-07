import { BiX } from 'react-icons/bi';
import { useGameIntroStore } from "./store";
import NavDots from "@components/Nav";
import { useNavigate } from 'react-router-dom';

const Header = ({ step, text }: {step: number , text?: string}) => {
  const [visited, close] = useGameIntroStore((state) => [state.visited, state.close]);
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className="w-full grid grid-cols-3 items-center">
        <div className="flex justify-start">
          {visited && <BiX size={24} className='text-light1' onClick={() => {
            navigate('/');
            close();
          }} />}
        </div>
        <div className="flex justify-center">
          <NavDots step={step} totalSteps={5}/>
        </div>
        <div></div> {/* This is a placeholder to keep the space on the right side equal to the left side */}
      </div>
      {text && <p className='self-center opacity-60 font-bold'>{text}</p>}
    </div>
  )
}

export default Header