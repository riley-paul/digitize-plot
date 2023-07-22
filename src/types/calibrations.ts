export type Calibration = {
  screen: number;
  actual: number;
};

export type Calibrations = {
  x1: Calibration;
  x2: Calibration;
  y1: Calibration;
  y2: Calibration;
};