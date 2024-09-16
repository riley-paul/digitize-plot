import type Calibrator from "@/geometry/calibrator";
import type Point from "@/geometry/point";

export type Calibrations = {
  x1: Calibrator;
  x2: Calibrator;
  y1: Calibrator;
  y2: Calibrator;
};

export type CoordsConverter = (coords: Point) => Point;

export type CoordsConvertGenerator = (
  calibrations: Calibrations,
) => CoordsConverter;
