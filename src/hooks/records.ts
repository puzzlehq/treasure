import { useRecords } from "@puzzlehq/sdk-react";
import { useEffect } from "react";

export const useGameRecords = () => {
  const { records } = useRecords({
    filter: {
      programIds: ["treasure_hunt_v010.aleo"],
      type: "unspent",
    },
    multisig: false,
  });

  useEffect(() => {
    console.log("records", records);
  }, [records?.toString()]);

  return records;
};
