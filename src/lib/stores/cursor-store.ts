import { create } from "zustand";

export enum CursorState {
  DEFAULT = "default",
  POINTER = "pointer",
  CROSSHAIR = "crosshair",
  MOVE = "move",
  TEXT = "text",
  WAIT = "wait",
  HELP = "help",
  GRAB = "grab",
  GRABBING = "grabbing",
  NOT_ALLOWED = "not-allowed",
  ZOOM_IN = "zoom-in",
  ZOOM_OUT = "zoom-out",
  EW_RESIZE = "ew-resize",
  NS_RESIZE = "ns-resize",
  NESW_RESIZE = "nesw-resize",
  NWSE_RESIZE = "nwse-resize",
  COL_RESIZE = "col-resize",
  ROW_RESIZE = "row-resize",
  ALL_SCROLL = "all-scroll",
  AUTO = "auto",
  COPY = "copy",
  NONE = "none",
  PROGRESS = "progress",
  CELL = "cell",
  CONTEXT_MENU = "context-menu",
  ALIAS = "alias",
  POINTER_EVENTS = "pointer-events",
  NO_DROP = "no-drop",
  VERTICAL_TEXT = "vertical-text",
}

type Store = {
  cursor: CursorState;
  setCursor: (cursor: CursorState) => void;
};

const useCursorStore = create<Store>()((set) => ({
  cursor: CursorState.AUTO,
  setCursor: (cursor) => set({ cursor }),
}));

export default useCursorStore;
