import {
  draggingCalIdAtom,
  draggingPointIdAtom,
  hoveringCalIdAtom,
  hoveringPointIdAtom,
} from "@/lib/store";
import { useAtomValue } from "jotai";

export default function useCursor(): React.CSSProperties["cursor"] {
  const draggingPointId = useAtomValue(draggingPointIdAtom);
  const hoveringPointId = useAtomValue(hoveringPointIdAtom);

  const draggingCalId = useAtomValue(draggingCalIdAtom);
  const hoveringCalId = useAtomValue(hoveringCalIdAtom);

  if (draggingCalId?.startsWith("x")) return "ew-resize";
  if (hoveringCalId?.startsWith("x")) return "ew-resize";
  if (draggingCalId?.startsWith("y")) return "ns-resize";
  if (hoveringCalId?.startsWith("y")) return "ns-resize";

  if (draggingPointId) return "grabbing";
  if (hoveringPointId) return "grab";

  return "crosshair";
}
