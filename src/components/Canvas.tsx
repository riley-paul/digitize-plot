import type { drawFunction } from "../types/functions";
import useCanvas from "./useCanvas";

export type Props = {
  draw: drawFunction;
} & object;

export default function Canvas(props: Props) {
  const { draw, ...rest } = props;
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest} />;
}
