import { draggingPointIdAtom } from "@/lib/store";
import { useAtomValue } from "jotai";

export default function useCursor(): React.CSSProperties["cursor"] {
  const draggingPointId = useAtomValue(draggingPointIdAtom);

  if (draggingPointId) return "move";

  return "default";
}
