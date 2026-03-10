import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { IconArrowsMaximize, IconX } from "@tabler/icons-react";
import type { CanvasRef } from "@/types";
import useCenterImage from "@/hooks/use-center-image";
import { useAtom } from "jotai";
import { imageAtom, pointsAtom } from "@/lib/store";
import usePoints from "@/hooks/use-points";

type Props = { canvasRef: CanvasRef };

const CanvasControls: React.FC<Props> = ({ canvasRef }) => {
  const [image, setImage] = useAtom(imageAtom);
  const centerImage = useCenterImage(canvasRef);
  const { clearPoints } = usePoints(pointsAtom);

  const handleClearImage = () => {
    setImage(undefined);
    clearPoints();
  };

  const handleCenterImage = () => {
    if (!image) return;
    centerImage(image);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Tooltip>
        <TooltipContent side="left">Clear image</TooltipContent>
        <TooltipTrigger>
          <Button size="icon-lg" onClick={handleClearImage}>
            <IconX />
          </Button>
        </TooltipTrigger>
      </Tooltip>
      <Tooltip>
        <TooltipContent side="left">Center image</TooltipContent>
        <TooltipTrigger>
          <Button size="icon-lg" onClick={handleCenterImage}>
            <IconArrowsMaximize />
          </Button>
        </TooltipTrigger>
      </Tooltip>
      ;
    </div>
  );
};

export default CanvasControls;
