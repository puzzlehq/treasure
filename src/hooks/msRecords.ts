import { useRecords } from '@puzzlehq/sdk';
import { RecordStatus } from '@puzzlehq/types';
import { useEffect } from 'react';

export const useMsRecords = (address?: string) => {
  const { records } = useRecords({
    filter: {
      programIds: [
        'treasure_hunt_v010.aleo',
      ],
      status: RecordStatus.Unspent,
    },
    address,
    multisig: true,
  });

  useEffect(() => {
    console.log('msRecords', records);
  }, [records?.toString()]);

  return records;
};
