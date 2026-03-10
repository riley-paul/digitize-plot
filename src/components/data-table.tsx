import Point from "src/geometry/point";

import { useAtom } from "jotai";
import { hoveringPointIdAtom, pointsAtom } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import usePoints from "@/hooks/use-points";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { IconSearch } from "@tabler/icons-react";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

const DataTable: React.FC<Props> = ({ coordsConverter }: Props) => {
  const { points } = usePoints(pointsAtom);
  const [hoveredPointId, setHoveredPointId] = useAtom(hoveringPointIdAtom);

  const toString = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  if (points.length === 0) {
    return (
      <Empty className="h-full px-4">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconSearch />
          </EmptyMedia>
          <EmptyTitle>No points</EmptyTitle>
          <EmptyDescription>
            Click on the plot to add points, and they will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Table>
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
            className={cn(hoveredPointId === pt.id && "bg-muted/50")}
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
