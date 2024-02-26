import { Step, useRevealAnswerStore } from "./-store";
import { useEffect } from "react";
import { useInitCurrentGame } from "@hooks/currentGame";
import { useEventHandling } from "@hooks/eventHandling";
import { Box } from "@components/Box";
import { Outlet, createFileRoute, useSearch } from "@tanstack/react-router";

// eslint-disable-next-line
export const Route = createFileRoute("/RevealAnswer/$gameId")({
  component: function Component() {
    const [step, eventId, setEventId, setStep] = useRevealAnswerStore(
      (state) => [state.step, state.eventId, state.setEventId, state.setStep],
    );
    const [searchParams] = useSearch({ from: Route.id });

    useInitCurrentGame();
    useEffect(() => {
      const _eventId = searchParams.get("eventId");
      if (_eventId) {
        setEventId(_eventId);
      }
    }, [searchParams]);

    useEventHandling({
      id: eventId,
      stepName: "Reveal Index",
      onSettled: () => setStep(Step._02_Confirmed),
    });

    return (
      <Box>
        <Outlet />
      </Box>
    );
  },
});
