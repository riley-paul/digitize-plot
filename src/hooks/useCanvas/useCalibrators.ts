import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Point from "../../geometry/Point";
import use2dContext from "./use2dContext";
import { Calibrations } from "../useCalibrations";

export default function useCalibrators(
  canvasRef: RefObject<HTMLCanvasElement>,
  mousePoint: Point | undefined,
  calibrations: Calibrations,
  setCalibrations: Dispatch<SetStateAction<Calibrations>>,
  debug: boolean
) {
  const [current, setCurrent] = useState<keyof Calibrations | undefined>();
  const context = use2dContext(canvasRef);

  const drawCalibrators = (ctx: CanvasRenderingContext2D): void => {
    Object.values(calibrations).forEach((calibrator) => {
      calibrator.draw(ctx);
    });
  };

  // Event handlers
  const mouseMoveCalibrators: MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {};

  const mouseDownCalibrators: MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {};

  const MouseUpCalibrators: MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {};

  // determine current calibrator
  useEffect(() => {
    if (!context || !mousePoint) {
      setCurrent(undefined);
      return;
    }

    const scale = context.getTransform().a;
    const distance = 2 / scale;
  }, [mousePoint, calibrations]);

  useEffect(() => {
    if (debug) console.log("current", current);
  }, [current]);

  return {
    drawCalibrators,
    mouseMoveCalibrators,
    mouseDownCalibrators,
    MouseUpCalibrators,
  };
}
