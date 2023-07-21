import useCanvas from "./hooks/useCanvasOnly";

function App() {
  const canvasProps = useCanvas();

  return (
    <main className="w-full h-screen">
      <canvas {...canvasProps} className="w-full h-full"/>
    </main>
  );
}

export default App;
