import Point from "src/geometry/point";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";

export type Props = {
  mousePoint: Point | undefined;
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { mousePoint, coordsConverter } = props;
  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <div className="grid gap-3 p-4">
      <h3 className="text-muted-foreground text-sm font-semibold uppercase">
        Mouse Coordinates
      </h3>
      <div className="grid gap-2">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>X</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput readOnly value={x.toLocaleString()} />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Y</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput readOnly value={y.toLocaleString()} />
        </InputGroup>
      </div>
    </div>
  );
}
