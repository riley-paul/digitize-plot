import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const showHelpAtom = atomWithStorage("showHelp", false);
export const debugAtom = atom(false);
