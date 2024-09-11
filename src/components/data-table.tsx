import Point from "src/geometry/point";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";

export type Props = {
  points: Point[];
  coordsConverter: (coords: Point) => Point;
};

export default function DataTable({ points, coordsConverter }: Props) {
  const toString = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  points = points.map(coordsConverter);

  return (
    <Table>
      {points.length === 0 && (
        <TableCaption>Points placed will be listed here</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2 text-center">X</TableHead>
          <TableHead className="w-1/2 text-center">Y</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {points.map((pt) => (
          <TableRow key={pt.id}>
            <TableCell className="text-center">{toString(pt.x)}</TableCell>
            <TableCell className="text-center">{toString(pt.y)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}