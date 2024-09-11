import { CSVLink } from "react-csv";
import Point from "src/geometry/point";
import { Button } from "./ui/button";
import { toast } from "sonner";

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
      onClick={() => toast.success("CSV downloaded")}
    >
      <Button disabled={points.length === 0} className="w-full">
        <i className="fa-solid fa-download mr-2" />
        Download CSV
      </Button>
    </CSVLink>
  );
}
