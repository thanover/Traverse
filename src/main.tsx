import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TraverseApp from "./components/TraverseApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TraverseApp />
  </StrictMode>,
);
