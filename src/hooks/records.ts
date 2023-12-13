import { useRecords } from '@puzzlehq/sdk';

export const useGameRecords = () => {
  const { records } = useRecords({
    filter: {
      programIds: [
        'treasure_hunt_v010.aleo',
      ],
      type: 'unspent',
    },
    multisig: false,
  });

  console.log('records', records);

  return records;
};
