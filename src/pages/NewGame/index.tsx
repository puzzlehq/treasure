import { Box } from "@components/Box";
import Button from "@components/Button";
import PageHeader from "@components/PageHeader";
import { BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useNewGameVsPersonStore } from "./vs_person/store";
import treasure_open_full from '@assets/treasure_open_full.png';

const NewGame = () => {
  const navigate = useNavigate();
  const [close] = useNewGameVsPersonStore((state) => [state.close])
  
  return (
    <Box>
      <div className="w-full grid grid-cols-[10%,80%,10%] items-start">
        <a className="flex justify-start align-top">
          <BiX size={24}
            className='text-light1'
            onClick={() => {
              close();
              navigate('/')
            }}
          />
        </a>
        <div className="flex justify-center">
          <PageHeader
            text='Ready to play?'
            bg='primary'
          />
        </div>
        <div></div> {/* This is a placeholder to keep the space on the right side equal to the left side */}
      </div>
      <img
        src={treasure_open_full}
        className="w-36"
      />
      <p>ZK gaming awaits</p>
      <div className="flex flex-col gap-2 w-full">
        <Button
          fullWidth
          variant='primary'
          onClick={() => navigate('./vs_bot')}
          disabled
        >
          Play with Leo
        </Button>
        <Button
          fullWidth
          variant='primary'
          onClick={() => navigate('./vs_person')}
        >
          Play with a friend
        </Button>
      </div>
    </Box>
  )
}

export default NewGame;