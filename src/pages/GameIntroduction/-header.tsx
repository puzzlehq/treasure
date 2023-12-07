import { BiX } from 'react-icons/bi';
import { Step, useGameIntroStore } from "./store";
import NavDots from "@components/Nav";
import { useNavigate } from 'react-router-dom';

const Header = ({ step }: {step: number}) => {
  const [close] = useGameIntroStore((state) => [state.close]);
  const navigate = useNavigate();
  return (
    <div className="w-full grid grid-cols-3 items-center">
      <div className="flex justify-start">
        <BiX size={24} className='text-light1' onClick={() => {
          navigate('/');
          close();
        }} />
      </div>
      <div className="flex justify-center">
        <NavDots step={step} totalSteps={5}/>
      </div>
      <div></div> {/* This is a placeholder to keep the space on the right side equal to the left side */}
    </div>
  )
}

export default Header