import { CSVLink } from "react-csv";
import Point from "src/geometry/point";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAtomValue } from "jotai";
import { pointsAtom } from "@/lib/store";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

export default function Download({ coordsConverter }: Props) {
  const points = useAtomValue(pointsAtom);
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
