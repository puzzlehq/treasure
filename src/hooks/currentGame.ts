import { useGameStore } from "@state/gameStore";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { Route as home_route } from "@routes/Home.js";
import { Route } from "@routes/__root.js";

export const useInitCurrentGame = () => {
  const navigate = useNavigate();
  const { game_multisig } = useParams({ from: Route.id });

  const [yourTurn, theirTurn, currentGame, setCurrentGame] = useGameStore(
    (state) => [
      state.yourTurn,
      state.theirTurn,
      state.currentGame,
      state.setCurrentGame,
    ],
  );

  useEffect(() => {
    if (game_multisig && !currentGame) {
      const games = [...yourTurn, ...theirTurn];
      const _currentGame = games.find(
        (game) =>
          game.gameNotification.recordData.game_multisig === game_multisig,
      );
      _currentGame && setCurrentGame(_currentGame);
    } else if (!game_multisig && !location.pathname.includes("NewGame")) {
      navigate({ to: home_route.to });
    }
  }, [game_multisig, currentGame, [...yourTurn, ...theirTurn].toString()]);

  useEffect(() => {
    console.log("current game", currentGame);
  }, [currentGame]);

  return { currentGame };
};
