import { BiX } from "react-icons/bi";
import NavDots from "@components/Nav";
import { useNavigate } from "@tanstack/react-router";
import { Step, useAleoIntroStore } from "./-store";

const Header = ({ step }: { step: number }) => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full grid grid-cols-3 items-center">
        <div
          className="flex justify-start"
          onClick={() => {
            navigate("/");
            setStep(Step._01_HiddenInformation);
          }}
        >
          <BiX size={24} className="text-light1" />
        </div>
        <div className="flex justify-center">
          <NavDots step={step} totalSteps={5} />
        </div>
        <div></div>{" "}
        {/* This is a placeholder to keep the space on the right side equal to the left side */}
      </div>
      <div className="flex flex-col gap-1">
        <p className="self-center opacity-60 font-bold">
          Intro to Treasure Hunt
        </p>
        <p className="self-center opacity-60">
          Private Multiparty Blockchain Gaming
        </p>
      </div>
    </div>
  );
};

export default Header;
