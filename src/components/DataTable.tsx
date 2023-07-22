import Point from "../geometry/Point";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      {points.length === 0 && <TableCaption>Points placed will be listed here</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-1/2">X</TableHead>
          <TableHead className="text-center w-1/2">Y</TableHead>
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
