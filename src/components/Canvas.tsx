import type { drawFunction } from "../types/functions";
import useCanvas from "../hooks/useCanvas";



export default function Canvas(props: Props) {
  const canvasRef = useCanvas();

  return <canvas ref={canvasRef} {...rest} />;
}
