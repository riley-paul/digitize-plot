import Point from "@/geometry/point";
import { toast } from "sonner";

export default function usePoints(
  points: Point[],
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>,
) {
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
