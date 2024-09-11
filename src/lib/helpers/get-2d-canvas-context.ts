import invariant from "tiny-invariant";

export default function get2dCanvasContext(
  canvasRef: React.RefObject<HTMLCanvasElement>,
): CanvasRenderingContext2D {
  const ctx = canvasRef.current?.getContext("2d");
  invariant(ctx, "Canvas context is null");
  return ctx;
}
