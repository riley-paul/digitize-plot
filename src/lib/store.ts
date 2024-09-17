import type Point from "@/geometry/point";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const showHelpAtom = atomWithStorage("showHelp", false);
export const debugAtom = atom(false);
export const pointsAtom = atom<Point[]>([]);
export const matrixAtom = atom(new DOMMatrix());
