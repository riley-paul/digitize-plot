import React from "react";
import Point from "src/geometry/point";
import Calibrator, {
  type CalibratorDrawOptions,
} from "src/geometry/calibrator";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtom, useAtomValue } from "jotai";
import { calibrationsAtom, debugAtom, mousePointAtom } from "@/lib/store";

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
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

export default function useCalibrators(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  image: HTMLImageElement | undefined,
) {
  const debug = useAtomValue(debugAtom);
  const mousePoint = useAtomValue(mousePointAtom);

  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);

  React.useEffect(() => {
    if (!image) return;
    setCalibrations({
      x1: new Calibrator("x1", 0, 0, "x"),
      x2: new Calibrator("x2", image.width, 1, "x"),
      y1: new Calibrator("y1", image.height, 0, "y"),
      y2: new Calibrator("y2", 0, 1, "y"),
    });
  }, [image]);

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

  const [current, setCurrent] = React.useState<
    keyof Calibrations | undefined
  >();
  const [dragging, setDragging] = React.useState<
    keyof Calibrations | undefined
  >();
  const ctx = get2dCanvasContext(canvasRef);

  const drawCalibrators = (ctx: CanvasRenderingContext2D): void => {
    const defaultDrawOptions: CalibratorDrawOptions = {
      colorX: "#2563eb",
      colorY: "#dc2626",
    };
    const hoverDrawOptions: CalibratorDrawOptions = {
      colorX: "#60a5fa",
      colorY: "#f87171",
    };

    for (let calibrator of Object.values(calibrations)) {
      if (dragging === calibrator.id) continue;
      const options =
        current === calibrator.id ? hoverDrawOptions : defaultDrawOptions;
      calibrator.draw(ctx, options);
    }

    if (dragging && mousePoint) {
      calibrations[dragging]
        .copyToPoint(mousePoint)
        .draw(ctx, hoverDrawOptions);
    }

    if (debug) {
      const origin = ctx
        .getTransform()
        .invertSelf()
        .transformPoint(new DOMPoint(0, 0));

      const scale = ctx!.getTransform().a;
      ctx.font = `${12 / scale}px Courier`;
      ctx.fillStyle = "red";
      ctx.fillText(
        `dragging ID: ${dragging}`,
        origin.x + 10 / scale,
        origin.y + 20 / scale,
      );
      ctx.fillText(
        `current ID: ${current}`,
        origin.x + 10 / scale,
        origin.y + 35 / scale,
      );
    }
  };

  const updateCalibrator = (id: keyof Calibrations, point: Point) => {
    setCalibrations((prev) => ({ ...prev, [id]: prev[id].copyToPoint(point) }));
  };

  const mouseDownCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (current && event.button === 0) {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
      setDragging(current);
    }
  };

  const mouseUpCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (dragging && mousePoint) {
      event.preventDefault();
      updateCalibrator(dragging, mousePoint);
      setDragging(undefined);
    }
  };

  const mouseMoveCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!ctx || !mousePoint) {
      setCurrent(undefined);
      return;
    }

    const scale = ctx.getTransform().a;
    const distance = 5 / scale;

    const sortNearest = (a: Calibrator, b: Calibrator) =>
      a.distPoint(mousePoint) - b.distPoint(mousePoint);
    const nearest = Object.values(calibrations).sort(sortNearest)[0];
    // console.log(nearest)

    if (nearest.distPoint(mousePoint) <= distance) {
      setCurrent(nearest.id as keyof Calibrations);
      return;
    }

    setCurrent(undefined);
  };

  React.useEffect(() => {
    if (debug) console.log("current", current);
  }, [current]);

  return {
    drawCalibrators,
    mouseDownCalibrators,
    mouseUpCalibrators,
    mouseMoveCalibrators,
    calibrations,
    setCalibrations,
    coordsConverter,
    markerDragging: current,
  };
}
