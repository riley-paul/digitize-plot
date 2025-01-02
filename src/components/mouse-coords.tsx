import { DataList, Heading } from "@radix-ui/themes";
import Point from "src/geometry/point";

export type Props = {
  mousePoint: Point | undefined;
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { mousePoint, coordsConverter } = props;
  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <div className="grid gap-2 p-4">
      <Heading as="h3" size="3">
        Mouse Coordinates
      </Heading>
      <DataList.Root className="gap-y-1.5 pl-2">
        <DataList.Item align="center">
          <DataList.Label minWidth="1rem">X</DataList.Label>
          <DataList.Value>{x.toLocaleString()}</DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label minWidth="1rem">Y</DataList.Label>
          <DataList.Value>{y.toLocaleString()}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </div>
  );
}
