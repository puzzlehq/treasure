import { useRecords } from '@puzzlehq/sdk';
import { RecordStatus } from '@puzzlehq/types';
import { useEffect } from 'react';

export const useGameRecords = () => {
  const { records } = useRecords({
    filter: {
      programIds: [
        'treasure_hunt_v010.aleo',
      ],
      status: RecordStatus.Unspent,
    },
    multisig: false,
  });

  useEffect(() => {
    console.log('records', records);
  }, [records?.toString()]);

  return records;
};
