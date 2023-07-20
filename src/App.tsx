import useCanvas from "./hooks/useCanvas";

function App() {
  const canvasRef = useCanvas();

  return (
    <main className="w-full h-screen">
      <canvas ref={canvasRef} />
    </main>
  );
}

export default App;
