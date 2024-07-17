import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner";

import "./globals.css";
import "@fontsource/space-mono";
import '@fontsource-variable/roboto-mono';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>,
);
