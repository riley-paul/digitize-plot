import React from "react";
import Point from "src/geometry/point";
import Calibrator, {
  type CalibratorDrawOptions,
} from "src/geometry/calibrator";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtom, useAtomValue } from "jotai";
import {
  calibrationsAtom,
  debugAtom,
  draggingCalIdAtom,
  hoveringCalIdAtom,
} from "@/lib/store";
import {
  intialCalibrations,
  type Calibrations,
} from "@/lib/interpolators/types";
import { linearCoordsConverterGenerator } from "@/lib/interpolators/linear";

export default function useCalibrators(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mousePoint: Point | undefined,
  image: HTMLImageElement | undefined,
) {
  const debug = useAtomValue(debugAtom);

  React.useEffect(() => {
    if (!image) return;
    setCalibrations({
      x1: new Calibrator("x1", 0, 0, "x"),
      x2: new Calibrator("x2", image.width, 1, "x"),
      y1: new Calibrator("y1", image.height, 0, "y"),
      y2: new Calibrator("y2", 0, 1, "y"),
    });
  }, [image]);

  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);

  const coordsConverter = linearCoordsConverterGenerator(calibrations);

  const [hoveringCalId, setHoveringCalId] = useAtom(hoveringCalIdAtom);
  const [draggingCalId, setDraggingCalId] = useAtom(draggingCalIdAtom);
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
      if (draggingCalId === calibrator.id) continue;
      const options =
        hoveringCalId === calibrator.id ? hoverDrawOptions : defaultDrawOptions;
      calibrator.draw(ctx, options);
    }

    if (draggingCalId && mousePoint) {
      calibrations[draggingCalId]
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
        `dragging ID: ${draggingCalId}`,
        origin.x + 10 / scale,
        origin.y + 20 / scale,
      );
      ctx.fillText(
        `current ID: ${hoveringCalId}`,
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
    if (hoveringCalId && event.button === 0) {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
      setDraggingCalId(hoveringCalId);
    }
  };

  const MouseUpCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (draggingCalId && mousePoint) {
      event.preventDefault();
      updateCalibrator(draggingCalId, mousePoint);
      setDraggingCalId(undefined);
    }
  };

  // determine current calibrator
  React.useEffect(() => {
    if (!ctx || !mousePoint) {
      setHoveringCalId(undefined);
      return;
    }

    const scale = ctx.getTransform().a;
    const distance = 5 / scale;

    const sortNearest = (a: Calibrator, b: Calibrator) =>
      a.distPoint(mousePoint) - b.distPoint(mousePoint);
    const nearest = Object.values(calibrations).sort(sortNearest)[0];
    // console.log(nearest)

    if (nearest.distPoint(mousePoint) <= distance) {
      setHoveringCalId(nearest.id as keyof Calibrations);
      return;
    }

    setHoveringCalId(undefined);
  }, [mousePoint, calibrations]);

  React.useEffect(() => {
    if (debug) console.log("current", hoveringCalId);
  }, [hoveringCalId]);

  return {
    drawCalibrators,
    mouseDownCalibrators,
    MouseUpCalibrators,
    calibrations,
    setCalibrations,
    coordsConverter,
    markerDragging: hoveringCalId,
  };
}
