import type Point from "@/geometry/point";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Calibrations } from "./interpolators/types";

export const showHelpAtom = atomWithStorage("showHelp", false);
export const debugAtom = atom(false);
export const pointsAtom = atom<Point[]>([]);
export const matrixAtom = atom(new DOMMatrix());

export const hoveringPointIdAtom = atom<string>("");
export const draggingPointIdAtom = atom<string>("");

export const hoveringCalIdAtom = atom<keyof Calibrations | undefined>();
export const draggingCalIdAtom = atom<keyof Calibrations | undefined>();
