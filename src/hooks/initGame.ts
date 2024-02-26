import { useAccount } from "@puzzlehq/sdk-react";
import { useEffect } from "react";
import { useGameStore } from "@state/gameStore";
import { useGameRecords } from "./records";
import { useMsRecords } from "./msRecords";

export const useInitGame = () => {
  const { account } = useAccount();

  const [currentGame, setRecords] = useGameStore((state) => [
    state.currentGame,
    state.setRecords,
  ]);

  const records = useGameRecords();
  const msRecords = useMsRecords(
    currentGame?.gameNotification.recordData.game_multisig,
  );

  useEffect(() => {
    if (records !== undefined && account) {
      setRecords(records, msRecords);
    }
  }, [records?.toString(), msRecords?.toString(), account?.address]);
};
