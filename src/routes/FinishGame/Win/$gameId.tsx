import { useEffect } from "react";
import { Step, useClaimPrizeWinStore } from "./-store";
import { Outlet, useSearch } from "@tanstack/react-router";
import { useInitCurrentGame } from "@hooks/currentGame";
import { useEventHandling } from "@hooks/eventHandling";
import { Box } from "@components/Box";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/FinishGame/Win/$gameId")({
  component: function Component() {
    const [step, eventId, setEventId, setStep] = useClaimPrizeWinStore(
      (state) => [state.step, state.eventId, state.setEventId, state.setStep],
    );
    const [searchParams] = useSearch({ from: Route.id });

    const { currentGame } = useInitCurrentGame();
    useEffect(() => {
      const _eventId = searchParams.get("eventId");
      if (_eventId) {
        setEventId(_eventId);
      }
    }, [searchParams]);

    useEventHandling({
      id: eventId,
      address: currentGame?.gameNotification.recordData.game_multisig,
      multisig: true,
      stepName: "Win Index",
      onSettled: () => setStep(Step._02_GameOver),
    });

    return (
      <Box>
        <Outlet />
      </Box>
    );
  },
});
