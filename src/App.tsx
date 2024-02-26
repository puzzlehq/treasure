import { AppHeader } from "@components/Header.js";
import { useAccount, useOnSessionDelete } from "@puzzlehq/sdk-react";
import { useInitGame } from "./hooks/initGame.js";
import MapImage from "@components/MapImage.js";
import { useEffect } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Route as welcome_route } from "@routes/Welcome.js";

const Rerouter = () => {
  const navigate = useNavigate();

  useOnSessionDelete(() => {
    navigate({ to: welcome_route.to });
  });

  return <></>;
};

function App() {
  const { account } = useAccount();

  useEffect(() => {
    console.log("account", account);
  }, [account]);

  useInitGame();

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-b from-[#7CF7FF] to-[#0DD4FF] font-body text-xs sm:text-base">
      <div className="z-10 flex w-full max-w-screen-sm flex-col overflow-y-auto">
        <Rerouter />
        <div className="flex w-full max-w-screen-sm flex-col overflow-y-auto">
          {account && account?.address && <AppHeader />}
          <div className="h-full w-full max-w-screen-sm p-4">
            <Outlet />
          </div>
        </div>
      </div>
      <MapImage />
    </div>
  );
}

export default App;
