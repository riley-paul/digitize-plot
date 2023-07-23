import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Point from "../../geometry/Point";
import use2dContext from "./use2dContext";
import { Calibrations } from "../useCalibrations";
import Calibrator from "@/geometry/Calibrator";

export default function useCalibrators(
  canvasRef: RefObject<HTMLCanvasElement>,
  mousePoint: Point | undefined,
  calibrations: Calibrations,
  setCalibrations: Dispatch<SetStateAction<Calibrations>>,
  debug: boolean
) {
  const [current, setCurrent] = useState<keyof Calibrations | undefined>();
  const [dragging, setDragging] = useState<keyof Calibrations | undefined>();
  const context = use2dContext(canvasRef);

  const drawCalibrators = (ctx: CanvasRenderingContext2D): void => {
    for (let calibrator of Object.values(calibrations)) {
      if (dragging === calibrator.id) continue;
      calibrator.draw(ctx, {});
    }

    if (dragging && mousePoint) {
      const draggee = calibrations[dragging];
      new Calibrator(
        dragging,
        draggee.axis === "x" ? mousePoint.x : mousePoint.y,
        0,
        draggee.axis
      ).draw(ctx, { color: "red" });
    }

    if (debug) {
      const origin = ctx
        .getTransform()
        .invertSelf()
        .transformPoint(new DOMPoint(0, 0));

      ctx.font = "12px Courier";
      ctx.fillStyle = "red";
      ctx.fillText(`dragging ID: ${dragging}`, origin.x + 10, origin.y + 20);
      ctx.fillText(`current ID: ${current}`, origin.x + 10, origin.y + 35);
    }
  };

  const updateCalibrator = (id: keyof Calibrations, point: Point) => {
    setCalibrations((prev) => {
      const prevCalibrator = prev[id];
      const newCoord = prevCalibrator.axis === "x" ? point.x : point.y;

      const newCalibrator = new Calibrator(
        id,
        newCoord,
        prevCalibrator.value,
        prevCalibrator.axis
      );
      return { ...prev, [id]: newCalibrator };
    });
  };

  const mouseDownCalibrators: MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (current && event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      setDragging(current);
    }
  };

  const MouseUpCalibrators: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (dragging && mousePoint) {
      event.preventDefault();
      updateCalibrator(dragging, mousePoint);
      setDragging(undefined);
    }
  };

  // determine current calibrator
  useEffect(() => {
    if (!context || !mousePoint) {
      setCurrent(undefined);
      return;
    }

    const scale = context.getTransform().a;
    const distance = 2 / scale;

    const sortNearest = (a: Calibrator, b: Calibrator) =>
      a.distPoint(mousePoint) - b.distPoint(mousePoint);
    const nearest = Object.values(calibrations).sort(sortNearest)[0];
    // console.log(nearest)

    if (nearest.distPoint(mousePoint) <= distance) {
      setCurrent(nearest.id as keyof Calibrations);
      return;
    }

    setCurrent(undefined);
  }, [mousePoint, calibrations]);

  useEffect(() => {
    if (debug) console.log("current", current);
  }, [current]);

  return {
    drawCalibrators,
    mouseDownCalibrators,
    MouseUpCalibrators,
    markerDragging: current,
  };
}
