import Calibrator from "@/geometry/calibrator";
import type Point from "@/geometry/point";

export type Calibrations = {
  x1: Calibrator;
  x2: Calibrator;
  y1: Calibrator;
  y2: Calibrator;
};

export const intialCalibrations: Calibrations = {
  x1: new Calibrator("x1", 0, 0, "x"),
  x2: new Calibrator("x2", 50, 1, "x"),
  y1: new Calibrator("y1", 50, 0, "y"),
  y2: new Calibrator("y2", 0, 1, "y"),
};

export type CoordsConverter = (coords: Point) => Point;

export type CoordsConverterGenerator = (
  calibrations: Calibrations,
) => CoordsConverter;
