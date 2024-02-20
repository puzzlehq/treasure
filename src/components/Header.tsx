import { useDisconnect, shortenAddress, useAccount } from '@puzzlehq/sdk-react';
import Button from './Button';
import { useGameStore } from '@state/gameStore';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage'

export const AppHeader = () => {
  const { account } = useAccount();
  const { disconnect, loading } = useDisconnect();
  const navigate = useNavigate();

  return (
    <div className='flex w-full items-stretch justify-between gap-5 p-4'>
      {account && account.address ? (
        <>
          <button
            onClick={() => {
              useGameStore.getState().clearFlowStores();
              navigate('/');
            }}
          >
            <p className='font-header text-2xl text-black'>
              Treasure Hunt
            </p>
          </button>
          <Button
            size='md'
            variant='secondary'
            className='w-fit'
            onClick={async () => {
              try {
                await disconnect();
              } catch (e){
                console.error(e)
              }
              useGameStore.getState().clearFlowStores();
              localforage.clear();
              navigate('/');
            }}
            disabled={loading}
          >
            {shortenAddress(account.address)}
          </Button>
        </>
      ) : (
        <div className='w-full self-stretch' />
      )}
    </div>
  );
};
