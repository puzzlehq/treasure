/* eslint-disable @typescript-eslint/no-explicit-any */
import Nav from "@components/Nav";
import PageHeader from "@components/PageHeader";
import Button from "@components/Button";
import { useGameStore } from "@state/gameStore";
import { useMemo, useState } from "react";
import { Step, useNewGameVsPersonStore } from "./store";

function SetWager() {
  const [error, setError] = useState<string | undefined>();
  const [inputs, setInputs, setStep] = useNewGameVsPersonStore((state) => [
    state.inputs,
    state.setInputs,
    state.setStep,
  ]);
  const [availableBalance, largestPiece] = useGameStore((state) => [
    state.availableBalance,
    state.largestPiece,
  ]);
  const [wager, setWager] = useState<number | undefined>(undefined);
  const wagerRecord = inputs?.wager_record;

  const onWagerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = Number(e.target.value);
    if (isNaN(input)) {
      setError("Please input a number");
    } else if (input > availableBalance) {
      setError("You do not have enough Pieces");
    } else {
      setError(undefined);
      setInputs({
        ...inputs,
        challenger_wager_amount: input.toString(),
        wager_record: largestPiece,
      });
    }
    setWager(input);
  };

  const { inputTextColor, inputOpacity } = useMemo(() => {
    return {
      inputTextColor: wager !== 0 ? "text-primary" : "",
      inputOpacity: wager === 0 ? "opacity-40" : "",
    };
  }, [wager]);

  const isDisabled =
    wager === undefined ||
    wager <= 0 ||
    wager > availableBalance ||
    !largestPiece ||
    !wagerRecord;

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <Nav step={2} totalSteps={5} />
      <PageHeader bg="bg-primary-blue" text="SET THE WAGER" />
      <input
        type="number"
        min={0}
        value={wager ?? ""}
        onChange={onWagerInput}
        className={`flex w-full flex-col rounded-lg border-[3px] border-primary-gray bg-transparent px-5 py-7 max-md:mt-10 ${inputTextColor} ${inputOpacity} self-center text-center text-3xl font-bold focus:outline-none focus:border-primary`}
        placeholder="Enter amount"
      />
      <p className="mx-auto mt-6">
        {"Available balance: " + availableBalance.toLocaleString()} Pieces
      </p>
      {error && <p className="mx-auto text-primary-red break-words">{error}</p>}
      <div className="flex flex-grow flex-col" />
      <div className="flex gap-4 w-full">
        <Button
          className="w-1/2"
          onClick={() => setStep(Step._02_HideBooty)}
          variant="tertiary"
        >
          BACK
        </Button>
        <Button
          className="w-1/2"
          onClick={() => setStep(Step._04_ConfirmStartGame)}
          disabled={isDisabled || !!error}
          variant="primary"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
}

export default SetWager;
