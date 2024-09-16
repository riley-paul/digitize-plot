import Point from "@/geometry/point";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const showHelpAtom = atomWithStorage("showHelp", true);

export const mousePointAtom = atom<Point | undefined>(new Point(0, 0, "MOUSE"));
export const pointsAtom = atom<Point[]>([]);
