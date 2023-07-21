import { CSVLink } from "react-csv";
import Point from "../geometry/Point";

export default function Download({
  data,
  coordsConverter,
}: {
  data: Point[];
  coordsConverter: (coords: Point) => Point;
}) {
  const csvData = data
    .map(coordsConverter)
    .map((marker) => ({ X: marker.x, Y: marker.y }));

  return (
    <div className="w-full p-4">
      <CSVLink data={csvData} filename="digitize-plot.csv">
        <button className="py-1 px-2 border-2 flex items-center justify-center w-full">
          Download CSV
        </button>
      </CSVLink>
    </div>
  );
}
