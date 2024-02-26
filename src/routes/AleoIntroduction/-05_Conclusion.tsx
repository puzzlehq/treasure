import Header from "./-header";
import { Step, useAleoIntroStore } from "./-store";
import Button from "@components/Button";
import { useNavigate } from "@tanstack/react-router";

const Conclusion = () => {
  const [setStep] = useAleoIntroStore((state) => [state.setStep]);
  const navigate = useNavigate();

  return (
    <>
      <Header step={4} />
      <p className="font-header text-4xl">Ready to play</p>
      <p className="font-header text-6xl">Treasure Hunt?</p>
      <div className="flex w-full gap-4">
        <Button
          className="w-1/2"
          onClick={() => setStep(Step._04_Rewards)}
          variant="tertiary"
        >
          BACK
        </Button>
        <Button
          className="w-1/2"
          onClick={() => {
            navigate("/");
            setStep(Step._01_HiddenInformation);
          }}
          variant="primary"
        >
          YES!
        </Button>
      </div>
    </>
  );
};

export default Conclusion;
