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
  draggingEntityIdAtom,
  hoveringEntityIdAtom,
  imgAtom,
  mousePointAtom,
} from "@/lib/store";
import type { Calibrations } from "@/lib/interpolators/types";

export default function useCalibrators(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const debug = useAtomValue(debugAtom);
  const mousePoint = useAtomValue(mousePointAtom);
  const image = useAtomValue(imgAtom);

  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);
  const [hoveringId, setHoveringId] = useAtom(hoveringEntityIdAtom);
  const [draggingId, setDraggingId] = useAtom(draggingEntityIdAtom);

  React.useEffect(() => {
    if (!image) return;
    setCalibrations({
      x1: new Calibrator("x1", 0, 0, "x"),
      x2: new Calibrator("x2", image.width, 1, "x"),
      y1: new Calibrator("y1", image.height, 0, "y"),
      y2: new Calibrator("y2", 0, 1, "y"),
    });
  }, [image]);

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
      if (draggingId === calibrator.id) continue;
      const options =
        hoveringId === calibrator.id ? hoverDrawOptions : defaultDrawOptions;
      calibrator.draw(ctx, options);
    }

    if (draggingId in calibrations && mousePoint) {
      calibrations[draggingId as keyof Calibrations]
        .copyToPoint(mousePoint)
        .draw(ctx, hoverDrawOptions);
    }
  };

  const updateCalibrator = (id: string, point: Point) => {
    if (!(id in calibrations)) return;
    setCalibrations((prev) => ({
      ...prev,
      [id]: prev[id as keyof Calibrations].copyToPoint(point),
    }));
  };

  const mouseDownCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (hoveringId && event.button === 0) {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
      setDraggingId(hoveringId);
    }
  };

  const mouseUpCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (draggingId && mousePoint) {
      event.preventDefault();
      updateCalibrator(draggingId, mousePoint);
      setDraggingId("");
    }
  };

  const mouseMoveCalibrators: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!ctx || !mousePoint) {
      setHoveringId("");
      return;
    }

    const scale = ctx.getTransform().a;
    const distance = 5 / scale;

    const sortNearest = (a: Calibrator, b: Calibrator) =>
      a.distPoint(mousePoint) - b.distPoint(mousePoint);
    const nearest = Object.values(calibrations).sort(sortNearest)[0];

    if (nearest.distPoint(mousePoint) <= distance) {
      setHoveringId(nearest.id as keyof Calibrations);
      return;
    }

    setHoveringId("");
  };

  React.useEffect(() => {
    if (debug) console.log("current calibrator", hoveringId);
  }, [hoveringId]);

  return {
    drawCalibrators,
    mouseDownCalibrators,
    mouseUpCalibrators,
    mouseMoveCalibrators,
  };
}
