import {
  MouseEventHandler,
  RefObject,
  useEffect,
  useState,
} from "react";
import Point from "../../geometry/Point";
import use2dContext from "./use2dContext";
import Calibrator from "@/geometry/Calibrator";

export type Calibrations = {
  x1: Calibrator;
  x2: Calibrator;
  y1: Calibrator;
  y2: Calibrator;
};

type LinearInterpValues = {
  x: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

function linearInterp(values: LinearInterpValues): number {
  const { x, x0, x1, y0, y1 } = values;
  // if ([y0, y1].some(isNaN)) return 0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

export default function useCalibrators(
  canvasRef: RefObject<HTMLCanvasElement>,
  mousePoint: Point | undefined,
  debug: boolean
) {
  const intialCalibrations: Calibrations = {
    x1: new Calibrator("x1", 20, 0, "x"),
    x2: new Calibrator("x2", 40, 0, "x"),
    y1: new Calibrator("y1", 20, 0, "y"),
    y2: new Calibrator("y2", 40, 0, "y"),
  };

  const [calibrations, setCalibrations] =
    useState<Calibrations>(intialCalibrations);

  const coordsConverter = (coords: Point): Point => {
    const xValues = {
      x: coords.x,
      x0: calibrations.x1.coord,
      x1: calibrations.x2.coord,
      y0: calibrations.x1.value,
      y1: calibrations.x2.value,
    };

    const yValues = {
      x: coords.y,
      x0: calibrations.y1.coord,
      x1: calibrations.y2.coord,
      y0: calibrations.y1.value,
      y1: calibrations.y2.value,
    };

    return new Point(linearInterp(xValues), linearInterp(yValues));
  };


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
      ).draw(ctx, );
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
    calibrations,
    setCalibrations,
    coordsConverter,
    markerDragging: current,
  };
}
