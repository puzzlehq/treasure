import scene_13 from "@assets/13.png";
import Header from "./-header";
import Button from "@components/Button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as chest_info_route } from "@routes/GameIntroduction/02_ChestInfo.js";
import { Route as unlocked_route } from "@routes/GameIntroduction/04_Unlocked.js";
import { Local } from "../../data/local";

export const Route = createFileRoute("/GameIntroduction/03_Locked")({
  loader: async () => {
    return await Local.getVisitedGameInfo();
  },
  component: function Component() {
    const navigate = useNavigate({ from: Route.id });
    return (
      <>
        <Header step={2} text="How the magic treasure chest works" visited />
        <div className="flex flex-col flex-grow align-middle items-center">
          <div className="rounded-lg bg-bg2 max-w-[300px] p-5">
            If you don't put enough puzzle pieces in the chest, you can't open
            it and lose them.
          </div>
          <img
            src={scene_13}
            alt="Locked Multiparty computation treasure chest"
            className="-mt-4"
          />
        </div>
        <div className="flex w-full gap-4">
          <Button
            className="w-1/2"
            onClick={() => navigate({ to: chest_info_route.to })}
            variant="tertiary"
          >
            BACK
          </Button>
          <Button
            className="w-1/2"
            onClick={() => navigate({ to: unlocked_route.to })}
            variant="primary"
          >
            NEXT
          </Button>
        </div>
      </>
    );
  },
});
