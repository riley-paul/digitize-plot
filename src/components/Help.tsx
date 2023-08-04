import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Dispatch, SetStateAction, useState } from "react";

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
    content:
      "Used to show quadtree agorithm at work.",
    coords: "bottom-0 right-0",
  },
];

export type Props = {
  setShowHelp: Dispatch<SetStateAction<boolean>>;
};

export default function Help(props: Props) {
  const { setShowHelp } = props;
  const [helpStep, setHelpStep] = useState(0);

  return (
    <Card className={"absolute w-96 m-4 " + helpSteps[helpStep].coords}>
      <CardHeader className="relative">
        <CardTitle>
          <span>? - {helpSteps[helpStep].title}</span>
        </CardTitle>
        <CardDescription>{helpSteps[helpStep].content}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button
          className="w-full"
          disabled={helpStep === 0}
          onClick={() => setHelpStep((prev) => prev - 1)}
        >
          Prev
        </Button>
        <Button
          className="w-full"
          disabled={helpStep === helpSteps.length - 1}
          onClick={() => setHelpStep((prev) => prev + 1)}
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
}
