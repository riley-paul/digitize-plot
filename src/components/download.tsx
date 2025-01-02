import { CSVLink } from "react-csv";
import Point from "src/geometry/point";
import { toast } from "sonner";
import { pointsAtom } from "@/lib/store";
import usePoints from "@/hooks/use-points";
import { Button } from "@radix-ui/themes";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

export default function Download({ coordsConverter }: Props) {
  const { points } = usePoints(pointsAtom);
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
