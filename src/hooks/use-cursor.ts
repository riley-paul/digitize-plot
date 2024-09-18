import {
  draggingCalIdAtom,
  draggingPointIdAtom,
  hoveringCalIdAtom,
} from "@/lib/store";
import { useAtomValue } from "jotai";

export default function useCursor(): React.CSSProperties["cursor"] {
  const draggingPointId = useAtomValue(draggingPointIdAtom);

  const draggingCalId = useAtomValue(draggingCalIdAtom);
  const hoveringCalId = useAtomValue(hoveringCalIdAtom);
  const calIds = [draggingCalId, hoveringCalId];

  if (calIds.some((i) => i?.startsWith("x"))) return "ew-resize";
  if (calIds.some((i) => i?.startsWith("y"))) return "ns-resize";

  if (draggingPointId) return "move";

  return "default";
}
