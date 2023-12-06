import GameParts from "./_01_GameParts";
import ChestInfo from "./_02_ChestInfo";
import Locked from "./_03_Locked";
import Unlocked from "./_04_Unlocked";
import Conclusion from "./_05_Conclusion";
import { Step, useGameIntroStore } from "./store";


const GameIntroduction = () => {
  const [step] = useGameIntroStore((state) => [state.step]);

  return (
    <div>
      {step === Step._01_GameParts && <GameParts/>}
      {step === Step._02_ChestInfo && <ChestInfo/>}
      {step === Step._03_Locked && <Locked/>}
      {step === Step._04_Unlocked && <Unlocked/>}
      {step === Step._05_Conclusion && <Conclusion/>}
    </div>
  )
}

export default GameIntroduction;