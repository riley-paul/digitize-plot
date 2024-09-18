import { hoveringPointIdAtom } from "@/lib/store";
import { useAtomValue } from "jotai";

export default function useCursor(): React.CSSProperties["cursor"] {
  const hoveredPointId = useAtomValue(hoveringPointIdAtom);

  if (hoveredPointId) return "move";

  return "default";
}
