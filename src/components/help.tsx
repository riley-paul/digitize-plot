import { useStep } from "usehooks-ts";

import { useSetAtom } from "jotai/react";
import { showHelpAtom } from "@/lib/store";
import { Button, Card, Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

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
  const setShowHelp = useSetAtom(showHelpAtom);
  const [currentStepNum, helpers] = useStep(helpSteps.length);
  const currentStep = helpSteps[currentStepNum - 1];

  const { canGoToPrevStep, canGoToNextStep, goToNextStep, goToPrevStep } =
    helpers;

  return (
    <Card
      className={cn("absolute m-4 grid w-96 gap-6", currentStep.coords)}
      size="3"
    >
      <header className="grid gap-3">
        <Heading size="4">? - {currentStep.title}</Heading>
        <Text color="gray" size="2">
          {currentStep.content}
        </Text>
      </header>
      <footer className="grid grid-cols-3 gap-2">
        <Button
          className="w-full"
          disabled={!canGoToPrevStep}
          onClick={goToPrevStep}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Prev
        </Button>
        <Button
          className="w-full"
          disabled={!canGoToNextStep}
          onClick={goToNextStep}
        >
          Next
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
        <Button
          className="w-full"
          variant="soft"
          onClick={() => setShowHelp(false)}
        >
          Go away
        </Button>
      </footer>
    </Card>
  );
};

export default Help;
