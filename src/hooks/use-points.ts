import Point from "@/geometry/point";
import { useAtom, type PrimitiveAtom } from "jotai";
import { toast } from "sonner";

export default function usePoints(atom: PrimitiveAtom<Point[]>) {
  const [points, setPoints] = useAtom(atom);

  const createPoint = (coords: Point) => {
    const point = new Point(coords.x, coords.y);
    setPoints((prev) => [...prev, point]);
  };

  const deletePoint = (id: string) => {
    setPoints((prev) => [...prev.filter((pt) => pt.id !== id)]);
  };

  const movePoint = (id: string, coords: Point) => {
    setPoints((prev) =>
      prev.map((pt) => (pt.id === id ? new Point(coords.x, coords.y, id) : pt)),
    );
  };

  const clearPoints = () => {
    const prevPoints = [...points];
    setPoints([]);
    toast(`${prevPoints.length} points cleared`, {
      action: {
        label: "Undo",
        onClick: () => setPoints(prevPoints),
      },
    });
  };

  return {
    createPoint,
    deletePoint,
    movePoint,
    clearPoints,
  };
}
