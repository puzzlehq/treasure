import { useRecords } from '@puzzlehq/sdk';

export const useMsRecords = (address?: string) => {
  const { records } = useRecords({
    filter: {
      programIds: [
        'treasure_hunt_v006.aleo',
      ],
      type: 'unspent',
    },
    address,
    multisig: true,
  });

  console.log('msRecords', records);

  return records;
};
