import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum Step {
  _01_HiddenInformation,
  _02_HiddenTreasure,
  _03_Verified,
  _04_Rewards,
  _05_Conclusion
}

type IntroStore = {
  step: Step;
  setStep: (step: Step) => void;
};

export const useAleoIntroStore = create<IntroStore>()(
  persist(
    (set) => ({
      step: Step._01_GameParts,
      setStep: (step: Step) => {
        set({ step });
      },
    }),
    {
      name: 'aleo-introduction',
    }
  )
);
