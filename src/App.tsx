import useCanvas from "./hooks/useCanvas";

function App() {
  const canvasProps = useCanvas();

  return (
    <div className="w-full h-screen flex">
      <aside className="w-80 bg-white shadow">hello there</aside>
      <main>
        <canvas {...canvasProps} className="w-full h-full" />
      </main>
    </div>
  );
}

export default App;
