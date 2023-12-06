import { Box } from "@components/Box";
import Button from "@components/Button";
import PageHeader from "@components/PageHeader";
import { useNavigate } from "react-router-dom";

const NewGame = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <PageHeader
        text='Ready to play?'
        bg='bg-primary-blue'
      />
      <p>ZK gaming awaits</p>
      <Button
        variant='primary'
        onClick={() => navigate('./vs_bot')}
      >
        Play with Leo the Pirate
      </Button>
      <Button
        variant='primary'
        onClick={() => navigate('./vs_person')}
      >
        Play with a friend
      </Button>
    </Box>
  )
}

export default NewGame;