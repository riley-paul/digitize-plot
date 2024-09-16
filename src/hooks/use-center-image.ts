import Point from "@/geometry/point";
import { matrixAtom } from "@/lib/store";
import { useSetAtom } from "jotai";

export default function useCenterImage(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const setMatrix = useSetAtom(matrixAtom);
  const centerImage = (image: HTMLImageElement) => {
    if (!canvasRef.current) return;
    setMatrix(() => {
      const canvasWidth = canvasRef.current?.width ?? 0;
      const canvasHeight = canvasRef.current?.height ?? 0;

      const scaleX = canvasWidth / image.width;
      const scaleY = canvasHeight / image.height;
      const scale = Math.min(scaleX, scaleY) * 0.8;

      const center = new Point(canvasWidth / 2, canvasHeight / 2);

      return new DOMMatrix()
        .translateSelf(center.x, center.y)
        .scaleSelf(scale, scale)
        .translateSelf(-center.x, -center.y)
        .translate(
          (canvasWidth - image.width) / 2,
          (canvasHeight - image.height) / 2,
        );
    });
  };

  return centerImage;
}
