import { Box } from "@components/Box";
import GameParts from "./-01_HiddenInformation";
import ChestInfo from "./-02_HiddenTreasure";
import Verified from "./-03_Verified";
import Unlocked from "./-04_Rewards";
import Conclusion from "./-05_Conclusion";
import { Step, useAleoIntroStore } from "./-store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/AleoIntroduction/")({
  component: function Component() {
    const [step] = useAleoIntroStore((state) => [state.step]);

    return (
      <Box>
        {step === Step._01_HiddenInformation && <GameParts />}
        {step === Step._02_HiddenTreasure && <ChestInfo />}
        {step === Step._03_Verified && <Verified />}
        {step === Step._04_Rewards && <Unlocked />}
        {step === Step._05_Conclusion && <Conclusion />}
      </Box>
    );
  },
});
