export default function get2dCanvasContext(
  canvasRef: React.RefObject<HTMLCanvasElement>,
): CanvasRenderingContext2D | null {
  return canvasRef.current?.getContext("2d") || null;
}
