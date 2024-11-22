import { useCopyToClipboard } from "usehooks-ts";
import usePoints from "./use-points";
import { pointsAtom } from "@/lib/store";
import { toast } from "sonner";
import type { CoordsConverter } from "@/lib/interpolators/types";

export default function useCopyPoints(converter: CoordsConverter) {
  const [copiedText, copy] = useCopyToClipboard();
  const { points } = usePoints(pointsAtom);

  const getText = () => {
    const pointsText = points
      .map(converter)
      .map(({ x, y }) => [x, y].join("\t"));
    pointsText.unshift("X\tY");
    return pointsText.join("\n");
  };

  const copyPoints = () => {
    copy(getText());
    toast.success(`Copied ${points.length} points to clipboard`);
  };

  const isCopied = copiedText === getText();

  return { copyPoints, isCopied };
}
