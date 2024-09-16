import React from "react";
import Point from "src/geometry/point";
import Calibrator, {
  type CalibratorDrawOptions,
} from "src/geometry/calibrator";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { createStore, useAtom, useAtomValue } from "jotai";
import {
  calibrationsAtom,
  draggingEntityIdAtom,
  hoveringEntityIdAtom,
  imgAtom,
  matrixAtom,
  mousePointAtom,
} from "@/lib/store";
import type { Calibrations } from "@/lib/interpolators/types";

export default function useCalibrators(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const mousePoint = useAtomValue(mousePointAtom);
  const image = useAtomValue(imgAtom);
  const matrix = useAtomValue(matrixAtom);

  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);

  const [hoveringId, setHoveringId] = React.useState("");
  const [draggingId, setDraggingId] = React.useState("");

  React.useEffect(() => {
    if (!image) return;
    setCalibrations({
      x1: new Calibrator("x1", 0, 0, "x"),
      x2: new Calibrator("x2", image.width, 1, "x"),
      y1: new Calibrator("y1", image.height, 0, "y"),
      y2: new Calibrator("y2", 0, 1, "y"),
    });
  }, [image]);

  const getNearestCalibrator = (calibrations: Calibrations) => {
    if (!mousePoint) {
      setHoveringId("");
      return;
    }
    const distance = 5 / matrix.a;

    const sortNearest = (a: Calibrator, b: Calibrator) =>
      a.distPoint(mousePoint) - b.distPoint(mousePoint);
    const nearest = Object.values(calibrations).sort(sortNearest)[0];

    if (nearest.distPoint(mousePoint) <= distance) {
      // console.log("nearest", nearest.id);
      setHoveringId(nearest.id);
      return;
    }

    setHoveringId("");
  };

  const drawCalibrators = (ctx: CanvasRenderingContext2D): void => {
    const defaultDrawOptions: CalibratorDrawOptions = {
      colorX: "#2563eb",
      colorY: "#dc2626",
    };
    const hoverDrawOptions: CalibratorDrawOptions = {
      colorX: "#60a5fa",
      colorY: "#f87171",
    };

    getNearestCalibrator(calibrations);

    for (let calibrator of Object.values(calibrations)) {
      const isHovering = hoveringId === calibrator.id;
      const isDragging = draggingId === calibrator.id;

      if (isDragging && mousePoint) {
        calibrator.copyToPoint(mousePoint).draw(ctx, hoverDrawOptions);
      }
      const options = isHovering ? hoverDrawOptions : defaultDrawOptions;
      calibrator.draw(ctx, options);
    }

    // if (draggingId in calibrations && mousePoint) {
    //   calibrations[draggingId as keyof Calibrations]
    //     .copyToPoint(mousePoint)
    //     .draw(ctx, hoverDrawOptions);
    // }
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

  return {
    drawCalibrators,
    mouseDownCalibrators,
    mouseUpCalibrators,
    // mouseMoveCalibrators,
  };
}
