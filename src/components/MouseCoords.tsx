import Point from "../geometry/Point";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type Props = {
  mousePoint: Point | undefined;
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { mousePoint, coordsConverter } = props;
  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <CardHeader>
      <CardTitle>Mouse Coordinates</CardTitle>
      <CardDescription>
        <div>X: {x.toLocaleString()}</div>
        <div>Y: {y.toLocaleString()}</div>
      </CardDescription>
    </CardHeader>
  );
}
