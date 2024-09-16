import usePoints from "@/hooks/use-points";
import { pointsAtom } from "@/lib/store";
import { useAtomValue } from "jotai";
import React from "react";
import { Button } from "@/components/ui/button";

const ClearPointsButton: React.FC = () => {
  const points = useAtomValue(pointsAtom);
  const { clearPoints } = usePoints(pointsAtom);
  return (
    <Button
      disabled={points.length === 0}
      className="w-full"
      variant="secondary"
      onClick={clearPoints}
    >
      <i className="fa-solid fa-broom mr-2" />
      Clear Points
    </Button>
  );
};

export default ClearPointsButton;
