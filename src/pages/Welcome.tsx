import { useAccount, useConnect } from '@puzzlehq/sdk-react';
import leo from '../assets/leo.png';
import Button from '../components/Button.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Welcome = () => {
  const navigate = useNavigate();
  const { account } = useAccount();
  const { loading: connectLoading, connect } = useConnect();

  useEffect(() => {
    if (account) {
      navigate("/home");
    }
  }, [account]);

  return (
    <div className='h-full w-full items-stretch justify-between'>
      <div className='align-items-center flex w-full justify-center'>
        <img
          src={leo}
          className='max-h-[163px]'
          alt={'Leo McPirate'}
        />
      </div>
      <div className='relative z-10 flex flex-col items-center justify-center rounded-[20px] border-[5px] border-bg2 bg-bg1 p-8'>
        <h1 className='text-primary-white overflow-visible whitespace-nowrap text-center font-header text-[96px] font-extrabold leading-[104.86px] tracking-tight'>
          TREASURE
          <br />
          HUNT
        </h1>
        <p className='text-primary-white mb-8 mt-8 max-w-[400px] text-center text-base font-bold tracking-tight'>
          Win rewards in a fun guessing game on Aleo. Play against friends or Leo the Pirate.
        </p>
        <div className='flex flex-col items-center w-full gap-2'>
          <Button
            variant='gray'
            size='md'
            onClick={() => navigate('/aleo-info')}
          >
            Learn more
          </Button>
          <Button
            className='font-pirata max-w-[250px] font-header'
            onClick={connect}
            variant='primary'
            disabled={connectLoading}
          >
            {connectLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  );
};