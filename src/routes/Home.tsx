import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import Button from "@components/Button";
import TotalWinnings from "@components/TotalWinnings";
import TheirTurn from "@components/TheirTurn";
import YourTurn from "@components/YourTurn";
import { useGameStore } from "@state/gameStore";
import { useNewGameVsPersonStore } from "./NewGame/vs_person/store";
import { useAccount } from "@puzzlehq/sdk-react";
import Info from "@components/Info";
import { Route as game_into_route } from "@routes/GameIntroduction/index.js";
import { Route as new_game_route } from "@routes/NewGame/vs_person.js";
import { Local } from "../data/local.js";

// eslint-disable-next-line
export const Route = createFileRoute("/Home")({
  beforeLoad: async () => {
    const visited = await Local.getVisitedGameInfo();

    if (!visited) {
      throw redirect({
        to: game_into_route.to,
      });
    }
  },
  component: function Component() {
    const [yourTurn, theirTurn, totalBalance] = useGameStore((state) => [
      state.yourTurn,
      state.theirTurn,
      state.totalBalance,
    ]);
    const [initialize] = useNewGameVsPersonStore((state) => [state.initialize]);
    const { account } = useAccount();
    const navigate = useNavigate({ from: Route.id });

    return (
      <div className="flex h-full flex-col justify-between ">
        <div className="flex w-full flex-col gap-4 px-1">
          <TotalWinnings amount={totalBalance} />
          <Button
            color="yellow"
            onClick={() => {
              if (!account) return;
              initialize(account?.address);
              navigate({ to: new_game_route.to });
            }}
            disabled={!account}
          >
            NEW GAME
          </Button>
          {yourTurn.length > 0 && <YourTurn games={yourTurn} />}
          {theirTurn.length > 0 && <TheirTurn games={theirTurn} />}
          {yourTurn.length === 0 && theirTurn.length === 0 && (
            <p className="self-center font-semibold">
              No ongoing games, start one with a friend!
            </p>
          )}
        </div>
        <div className="mt-4 pb-4 text-center">
          <Info />
        </div>
      </div>
    );
  },
});
