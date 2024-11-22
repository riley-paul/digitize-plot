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
import { useAtom, useAtomValue } from "jotai";
import { hoveringPointIdAtom, pointsAtom } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import usePoints from "@/hooks/use-points";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

const DataTable: React.FC<Props> = ({ coordsConverter }: Props) => {
  const { points } = usePoints(pointsAtom);
  const [hoveredPointId, setHoveredPointId] = useAtom(hoveringPointIdAtom);

  const toString = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  React.useEffect(() => {
    console.log(hoveredPointId);
  }, [hoveredPointId]);

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
        {points.map(coordsConverter).map((pt) => (
          <TableRow
            key={pt.id}
            className={cn(hoveredPointId === pt.id && "bg-red-500")}
            onMouseEnter={() => setHoveredPointId(pt.id)}
            onMouseLeave={() => setHoveredPointId("")}
          >
            <TableCell className="text-center">{toString(pt.x)}</TableCell>
            <TableCell className="text-center">{toString(pt.y)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
