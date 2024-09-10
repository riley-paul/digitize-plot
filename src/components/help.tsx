import { Button } from "src/components/ui/button";
import { useStep } from "usehooks-ts";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

import useHelpStore from "../lib/stores/help-store";

type Step = { title: string; content: string; coords: string };

const helpSteps: Step[] = [
  {
    title: "Pan and Zoom",
    content:
      "Zoom in and out using the scroll wheel. Pan around by dragging with the right mouse button.",
    coords: "bottom-0 left-0",
  },
  {
    title: "Calibrating",
    content:
      "Drag the horizontal and vertical calibration lines to coincide with a known value on the plot. Enter their locations in the right side panel.",
    coords: "top-1/3 right-0",
  },
  {
    title: "Points",
    content:
      "Left click to place points. Right click to delete. Drag to adjust position.",
    coords: "top-0 left-0",
  },
  {
    title: "Debug",
    content: "Used to show quadtree agorithm at work.",
    coords: "bottom-0 right-0",
  },
];

const Help: React.FC = () => {
  const { setShowHelp } = useHelpStore();
  const [currentStepNum, helpers] = useStep(helpSteps.length);
  const currentStep = helpSteps[currentStepNum - 1];

  const { canGoToPrevStep, canGoToNextStep, goToNextStep, goToPrevStep } =
    helpers;

  return (
    <Card className={"absolute m-4 w-96 " + currentStep.coords}>
      <CardHeader className="relative">
        <CardTitle>
          <span>? - {currentStep.title}</span>
        </CardTitle>
        <CardDescription>{currentStep.content}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button
          className="w-full"
          disabled={!canGoToPrevStep}
          onClick={goToPrevStep}
        >
          Prev
        </Button>
        <Button
          className="w-full"
          disabled={!canGoToNextStep}
          onClick={goToNextStep}
        >
          Next
        </Button>
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => setShowHelp(false)}
        >
          Go Away
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Help;
