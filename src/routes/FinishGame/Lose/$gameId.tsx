import { Box } from "@components/Box";
import Button from "@components/Button";
import { useInitCurrentGame } from "@hooks/currentGame";
import { shortenAddress } from "@puzzlehq/sdk-react";
import { getAnswer } from "@state/RecordTypes/treasure_hunt_vxxx";
import { useGameStore } from "@state/gameStore";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as home_route } from "@routes/Home.js";
import PageHeader from "@components/PageHeader";
import SelectedTreasureLocation from "@components/SelectedTreasureLocation";
import Wager from "@components/Wager";

export const Route = createFileRoute("/FinishGame/Lose/$gameId")({
  component: function Component() {
    useInitCurrentGame();
    const navigate = useNavigate();
    const [currentGame] = useGameStore((state) => [state.currentGame]);

    if (
      !currentGame ||
      currentGame?.gameNotification.recordData.ix !== "24u32"
    ) {
      return (
        <div className="flex h-full w-full flex-col justify-center gap-4">
          <p>oops! you aren't supposed to be here</p>
          <div className="flex flex-grow flex-col" />
          <Button
            onClick={() => navigate({ to: home_route.to })}
            color="transparent"
          >
            GO HOME
          </Button>
        </div>
      );
    }

    const {
      total_pot,
      challenger_answer,
      owner,
      opponent_address,
      opponent_answer,
      challenger_address,
    } = currentGame.gameNotification.recordData;

    const wager = (total_pot ?? 0) / 2;
    const user = owner;
    const isChallenger = user === challenger_address;

    return (
      <Box>
        <div className="flex h-full w-full flex-col justify-center gap-4">
          <PageHeader text="WHERE'S THE BOOTY" bg="bg-primary-blue" />
          <Wager wagerAmount={wager} winnings={false} />
          <div className="flex flex-col gap-2">
            {challenger_answer && (
              <SelectedTreasureLocation
                answer={getAnswer(challenger_answer)}
                win={false}
              />
            )}
            <div className="self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight text-primary-red">
              {isChallenger
                ? `You put the booty ${getAnswer(challenger_answer)}`
                : `${shortenAddress(challenger_address)} put the booty ${getAnswer(
                    challenger_answer,
                  )}`}
            </div>
            <div className="self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight text-primary-red">
              {!isChallenger
                ? `You guessed the booty was ${getAnswer(opponent_answer)}`
                : `${shortenAddress(opponent_address)} guessed the booty was ${getAnswer(
                    opponent_answer,
                  )}`}
            </div>
          </div>
          <div className="flex flex-grow flex-col" />
          <Button
            onClick={() => navigate({ to: home_route.to })}
            color="transparent"
          >
            GO HOME
          </Button>
        </div>
      </Box>
    );
  },
});
