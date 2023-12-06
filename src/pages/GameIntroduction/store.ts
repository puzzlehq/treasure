import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum Step {
  _01_GameParts,
  _02_ChestInfo,
  _03_Locked,
  _04_Unlocked,
  _05_Conclusion
}

type IntroStore = {
  step: Step;
  visited: boolean;
  setStep: (step: Step) => void;
  close: () => void;
};

export const useGameIntroStore = create<IntroStore>()(
  persist(
    (set) => ({
      visited: false,
      step: Step._01_GameParts,
      setStep: (step: Step) => {
        set({ step });
      },
      close: () => {
        set({
          visited: true
        });
      },
    }),
    {
      name: 'introduction',
    }
  )
);
