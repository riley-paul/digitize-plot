import { CSVLink } from "react-csv";
import Point from "../geometry/Point";
import { Button } from "./ui/button";

export type Props = {
  points: Point[];
  coordsConverter: (coords: Point) => Point;
};

export default function Download({ points, coordsConverter }: Props) {
  const csvData = points
    .map(coordsConverter)
    .map((marker) => ({ X: marker.x, Y: marker.y }));

  return (
    <CSVLink
      data={csvData}
      filename="digitize-plot.csv"
      onClick={() => points.length > 0}
    >
      <Button disabled={points.length === 0} className="w-full">
        Download CSV
      </Button>
    </CSVLink>
  );
}
