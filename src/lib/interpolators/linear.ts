import Point from "@/geometry/point";
import type { CoordsConvertGenerator } from "./types";

type LinearInterpProps = {
  x: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

const linearInterp = (values: LinearInterpProps): number => {
  const { x, x0, x1, y0, y1 } = values;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
};

export const linearInterpGenerator: CoordsConvertGenerator = (calibrations) => {
  return (coords: Point): Point => {
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
};
