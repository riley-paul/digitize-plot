import Point from "../geometry/Point";

export type Props = {
  mousePoint: Point | undefined;
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { mousePoint, coordsConverter } = props;
  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <div className="p-4 bg-white text-sm">
      <h2 className="font-bold text-base">Mouse Coordinates</h2>
      <div>X: {x.toLocaleString()}</div>
      <div>Y: {y.toLocaleString()}</div>
    </div>
  );
}
