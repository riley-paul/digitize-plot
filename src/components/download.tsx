import { CSVLink } from "react-csv";
import Point from "src/geometry/point";
import { toast } from "sonner";
import { pointsAtom } from "@/lib/store";
import usePoints from "@/hooks/use-points";

export type Props = React.PropsWithChildren<{
  coordsConverter: (coords: Point) => Point;
}>;

const DownloadLink: React.FC<Props> = ({ coordsConverter, children }) => {
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
      {children}
    </CSVLink>
  );
};

export default DownloadLink;
