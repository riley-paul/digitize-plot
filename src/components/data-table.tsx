import Point from "src/geometry/point";

import { useAtom, useAtomValue } from "jotai";
import { hoveringPointIdAtom, pointsAtom } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import usePoints from "@/hooks/use-points";
import { Table } from "@radix-ui/themes";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

const DataTable: React.FC<Props> = ({ coordsConverter }: Props) => {
  const { points } = usePoints(pointsAtom);
  const [hoveredPointId, setHoveredPointId] = useAtom(hoveringPointIdAtom);

  const toString = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell className="w-1/2 text-center">
            X
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="w-1/2 text-center">
            Y
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {points.map(coordsConverter).map((pt) => (
          <Table.Row
            key={pt.id}
            className={cn(hoveredPointId === pt.id && "bg-muted/50")}
            onMouseEnter={() => setHoveredPointId(pt.id)}
            onMouseLeave={() => setHoveredPointId("")}
          >
            <Table.Cell className="text-center">{toString(pt.x)}</Table.Cell>
            <Table.Cell className="text-center">{toString(pt.y)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      {/* {points.length === 0 && <caption>No points placed</caption>} */}
    </Table.Root>
  );
};

export default DataTable;
