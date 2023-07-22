import Calibrator from "@/geometry/Calibrator";
import Point from "@/geometry/Point";
import { useState } from "react";

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

export default function useCalibrations() {
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
      x0: calibrations.x1.screen,
      x1: calibrations.x2.screen,
      y0: calibrations.x1.actual,
      y1: calibrations.x2.actual,
    };

    const yValues = {
      x: coords.y,
      x0: calibrations.y1.screen,
      x1: calibrations.y2.screen,
      y0: calibrations.y1.actual,
      y1: calibrations.y2.actual,
    };

    return new Point(linearInterp(xValues), linearInterp(yValues));
  };

  return {
    calibrations,
    setCalibrations,
    coordsConverter,
  };
}
