import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Wager from "@components/Wager.js";
import PageHeader from "@components/PageHeader.js";
import { getNumberAmount } from "../../../../utils.js";
import Button from "@components/Button.js";
import { useGameStore } from "@state/gameStore.js";
import { useClaimPrizeWinStore } from "../-store.js";
import { Route as home_route } from "@routes/Home.js";
import { Route as new_game_route } from "@routes/NewGame/vs_person.js";

export const Route = createFileRoute("/FinishGame/Win/$gameId/02_Gameover")({
  component: function Component() {
    const [currentGame] = useGameStore((state) => [state.currentGame]);
    const [_close] = useClaimPrizeWinStore((state) => [state.close]);
    const navigate = useNavigate();

    const wager = (currentGame?.gameNotification.recordData.total_pot ?? 0) / 2;

    return (
      <div className="flex h-full w-full flex-col justify-center gap-2">
        <PageHeader bg="bg-primary-blue" text="CONGRATS WINNER!" />
        <div className="flex flex-col items-center gap-2">
          <Wager wagerAmount={getNumberAmount(wager)} winnings={true} />
          <a
            className={`font-extrabold text-primary-green hover:text-primary-green hover:underline`}
            href="/"
          >
            Payout Confirmation
          </a>
        </div>
        <div className="flex flex-grow flex-col" />
        <div className="flex w-full flex-col gap-2">
          <Button
            fullWidth
            color="gray"
            onClick={() => {
              navigate({ to: new_game_route.to });
              _close();
            }}
          >
            START ANOTHER GAME
          </Button>
          <Button
            fullWidth
            color="transparent"
            className=" text-primary-gray"
            onClick={() => {
              navigate({ to: home_route.to });
              _close();
            }}
          >
            TAKE ME BACK HOME
          </Button>
        </div>
      </div>
    );
  },
});
