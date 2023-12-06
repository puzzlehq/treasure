import { useAccount } from '@puzzlehq/sdk';
import { useEffect } from 'react';
import { useGameStore } from '@state/gameStore';
import { useGameRecords } from './records';

export const useInitGame = () => {
  const { account } = useAccount();

  const [setRecords] = useGameStore((state) => [state.setRecords]);

  const records = useGameRecords();

  useEffect(() => {
    if (
      records !== undefined &&
      account
    ) {
      setRecords(
        records,
      );
    }
  }, [
    records?.toString(),
    account?.address,
  ]);
};
