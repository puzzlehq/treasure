import scene_12 from "@assets/12.png";
import Header from "./-header";
import Button from "@components/Button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as game_parts_route } from "@routes/GameIntroduction/01_GameParts.js";
import { Route as locked_route } from "@routes/GameIntroduction/03_Locked.js";
import { Local } from "../../data/local.js";

export const Route = createFileRoute("/GameIntroduction/02_ChestInfo")({
  loader: async () => {
    return await Local.getVisitedGameInfo();
  },
  component: function Component() {
    const navigate = useNavigate({ from: Route.id });

    return (
      <>
        <Header step={1} text="How the magic treasure chest works" visited />
        <div className="flex flex-col flex-grow align-middle items-center">
          <div className="rounded-lg bg-bg2 max-w-[300px] p-5">
            You can open the chest if you put enough puzzle pieces in it.
          </div>
          <img
            src={scene_12}
            alt="Multiparty computation treasure chest"
            className="-mt-4"
          />
        </div>
        <div className="flex w-full gap-4">
          <Button
            className="w-1/2"
            onClick={() => navigate({ from: game_parts_route.to })}
            variant="tertiary"
          >
            BACK
          </Button>
          <Button
            className="w-1/2"
            onClick={() => navigate({ to: locked_route.to })}
            variant="primary"
          >
            NEXT
          </Button>
        </div>
      </>
    );
  },
});
