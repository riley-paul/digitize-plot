// import { CSVLink } from "react-csv";
import Point from "@/geometry/point";
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
    <Button
      disabled={points.length === 0}
      onClick={() => toast.info("Not implemented")}
      className="w-full"
    >
      <i className="fa-solid fa-download mr-2" />
      Download CSV
    </Button>
  );
}
