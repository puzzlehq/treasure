import aleo_logo from '@assets/aleo_logo.png';
import Header from "./-header";
import { Step, useAleoIntroStore } from './store';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

const HiddenInformation = () => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);
  const navigate = useNavigate();

  return (
    <>
      <Header step={0} />
      <div className='w-[50px] h-[50px] bg-bg2 rounded-full items-center align-middle'>
        <img
          src={aleo_logo}
          className='w-6 h-6'
        />
      </div>
      <p className='font-heading text-4xl'>Hidden information onchain games with Aleo</p>
      <p>Blockchains can’t normally support hidden information games, because player actions can be sniped.  Aleo’s ZK cryptography enforced at the L1 solves this.</p>
      <div className='flex w-full gap-4'>
        <Button
          fullWidth
          onClick={() => navigate('/')}
          variant='tertiary'
        >
          BACK
        </Button>
        <Button
          fullWidth
          onClick={() => setStep(Step._02_HiddenTreasure)}
          variant='primary'
        >
          NEXT
        </Button>
      </div>
    </>
  )
}

export default HiddenInformation