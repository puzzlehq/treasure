import { useAccount } from '@puzzlehq/sdk';
import { useEffect } from 'react';
import { useGameStore } from '@state/gameStore';
import { useGameRecords } from './records';
import { useMsRecords } from './msRecords';

export const useInitGame = () => {
  const { account } = useAccount();

  const [currentGame, setRecords] = useGameStore((state) => [state.currentGame, state.setRecords]);

  const msRecords = useMsRecords(currentGame?.gameNotification.recordData.challenger_address);
  const records = useGameRecords();

  useEffect(() => {
    if (
      records !== undefined &&
      msRecords !== undefined && 
      account
    ) {
      setRecords(
        records,
        msRecords
      );
    }
  }, [
    records?.toString(),
    msRecords?.toString(),
    account?.address,
  ]);
};
