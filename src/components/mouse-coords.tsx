import Point from "src/geometry/point";

export type Props = {
  mousePoint: Point | undefined;
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { mousePoint, coordsConverter } = props;
  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <div className="grid gap-3 p-4">
      <h3 className="text-muted-foreground text-sm font-semibold uppercase">
        Mouse Coordinates
      </h3>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="text-muted-foreground">X</div>
        <div className="font-medium">{x.toLocaleString()}</div>
        <div className="text-muted-foreground">Y</div>
        <div className="font-medium">{y.toLocaleString()}</div>
      </div>
    </div>
  );
}
