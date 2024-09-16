import Calibrator from "@/geometry/calibrator";
import Point from "@/geometry/point";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Calibrations, CoordsConverter } from "./interpolators/types";
import { linearInterpGenerator } from "./interpolators/linear";

export const showHelpAtom = atomWithStorage("showHelp", true);

export const mousePointAtom = atom<Point | undefined>(new Point(0, 0, "MOUSE"));
export const pointsAtom = atom<Point[]>([]);

export const calibrationsAtom = atom<Calibrations>({
  x1: new Calibrator("x1", 0, 0, "x"),
  x2: new Calibrator("x2", 50, 1, "x"),
  y1: new Calibrator("y1", 50, 0, "y"),
  y2: new Calibrator("y2", 0, 1, "y"),
});
export const coordsConverterLinearAtom = atom<CoordsConverter>((get) =>
  linearInterpGenerator(get(calibrationsAtom)),
);
export const matrixAtom = atom<DOMMatrix>(new DOMMatrix());

export const imgAtom = atom<HTMLImageElement | undefined>(undefined);
export const debugAtom = atom<boolean>(false);
