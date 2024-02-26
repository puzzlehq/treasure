import { Step, useNewGameVsPersonStore } from "./vs_person/store";
import { useEffect } from "react";
import { useInitCurrentGame } from "@hooks/currentGame";
import { useEventHandling } from "@hooks/eventHandling";
import { Box } from "@components/Box";
import { useAccount } from "@puzzlehq/sdk-react";
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Route as home_route } from '@routes/Home.js';
 
export const Route = createFileRoute("/NewGame/vs_person")({
  component: function Component() {
    const navigate = useNavigate();
    const [step, eventId, inputs, setInputs, setEventId, setStep] =
      useNewGameVsPersonStore((state) => [
        state.step,
        state.eventId,
        state.inputs,
        state.setInputs,
        state.setEventId,
        state.setStep,
      ]);

    const { account } = useAccount();

    useEffect(() => {
      if (!account) return;
      setInputs({ ...inputs, challenger: account.address });
    }, [account]);

    const done = () => {
      setInputs({});
      setStep(Step._01_NewGame);
      navigate({ to: home_route.to });
    };

    const [searchParams] = useSearch({from: Route.id});

    useInitCurrentGame();
    useEffect(() => {
      const _eventId = searchParams.get("eventId");
      if (_eventId) {
        setEventId(_eventId);
      }
    }, [searchParams]);

    useEventHandling({
      id: eventId,
      stepName: "Vs Person",
      onSettled: () => setStep(Step._05_GameStarted),
    });

    return (
      <Box>
        <Outlet/>
      </Box>
    );
  },
});
