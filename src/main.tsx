import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./app/App.tsx";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>,
);
