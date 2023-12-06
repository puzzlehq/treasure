import { Box } from "@components/Box";
import GameParts from "./_01_HiddenInformation";
import ChestInfo from "./_02_HiddenTreasure";
import Verified from "./_03_Verified";
import Unlocked from "./_04_Rewards";
import Conclusion from "./_05_Conclusion";
import { Step, useAleoIntroStore } from "./store";


const AleoIntroduction = () => {
  const [step] = useAleoIntroStore((state) => [state.step]);

  return (
    <Box>
      {step === Step._01_HiddenInformation && <GameParts/>}
      {step === Step._02_HiddenTreasure && <ChestInfo/>}
      {step === Step._03_Verified && <Verified/>}
      {step === Step._04_Rewards && <Unlocked/>}
      {step === Step._05_Conclusion && <Conclusion/>}
    </Box>
  )
}

export default AleoIntroduction;