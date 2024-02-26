import scene_14 from "@assets/14.png";
import Header from "./-header";
import Button from "@components/Button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as locked_route } from "@routes/GameIntroduction/03_Locked.js";
import { Route as conclusion_route } from "@routes/GameIntroduction/05_Conclusion.js";
import { Local } from "../../data/local.js";

export const Route = createFileRoute("/GameIntroduction/04_Unlocked")({
  loader: async () => {
    return await Local.getVisitedGameInfo();
  },
  component: function Component() {
    const navigate = useNavigate({ from: Route.id });

    return (
      <>
        <Header step={3} text="How the magic treasure chest works" visited />
        <div className="flex flex-col flex-grow align-middle items-center">
          <div className="rounded-lg bg-bg2 max-w-[300px] p-5">
            If someone with the master puzzle key (like Leo the Pirate) comes
            in, they can loot your lost puzzle pieces!
          </div>
          <img
            src={scene_14}
            alt="Multiparty computation treasure chest"
            className="-mt-4"
          />
        </div>
        <div className="flex w-full gap-4">
          <Button
            className="w-1/2"
            onClick={() => navigate({ to: locked_route.to })}
            variant="tertiary"
          >
            BACK
          </Button>
          <Button
            className="w-1/2"
            onClick={() => navigate({ to: conclusion_route.to })}
            variant="primary"
          >
            NEXT
          </Button>
        </div>
      </>
    );
  },
});
