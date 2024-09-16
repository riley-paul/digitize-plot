import Point from "src/geometry/point";
import { CardHeader, CardTitle } from "src/components/ui/card";
import { useAtomValue } from "jotai";
import { mousePointAtom } from "@/lib/store";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { coordsConverter } = props;
  const mousePoint = useAtomValue(mousePointAtom);

  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <CardHeader>
      <CardTitle>Mouse Coordinates</CardTitle>
      <div className="text-sm text-muted-foreground">
        <p>X: {x.toLocaleString()}</p>
        <p>Y: {y.toLocaleString()}</p>
      </div>
    </CardHeader>
  );
}
