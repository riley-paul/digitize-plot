import Point from "../geometry/Point";

export default function DataTable(props: {
  data: Point[];
  coordsConverter: (coords: Point) => Point;
}) {
  const { data, coordsConverter } = props;
  const toString = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <table className="w-full mt-4">
      <thead className="border-b-2">
        <tr>
          <th>X</th>
          <th>Y</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {data.map((row, index) => {
          const { x, y } = coordsConverter(row);
          return (
            <tr key={index}>
              <td className="text-center">{toString(x)}</td>
              <td className="text-center">{toString(y)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
