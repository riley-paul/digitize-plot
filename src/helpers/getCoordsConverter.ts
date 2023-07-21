import { CalibrationState } from "../reducers/calibrationReducer";
import XY from "../types/XY";

interface LinearInterpValues {
  x: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

function linearInterp(values: LinearInterpValues): number {
  const { x, x0, x1, y0, y1 } = values;
  // if ([y0, y1].some(isNaN)) return 0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

export default function getCoordsConverter(
  state: CalibrationState
): (coords: XY) => XY {
  return (coords: XY) => {
    const xValues = {
      x: coords.x,
      x0: state.x1.x,
      x1: state.x2.x,
      y0: parseFloat(state.x1.value) || 0,
      y1: parseFloat(state.x2.value) || 0,
    };

    const yValues = {
      x: coords.y,
      x0: state.y1.y,
      x1: state.y2.y,
      y0: parseFloat(state.y1.value) || 0,
      y1: parseFloat(state.y2.value) || 0,
    };

    return {
      x: linearInterp(xValues),
      y: linearInterp(yValues),
    };
  };
}
