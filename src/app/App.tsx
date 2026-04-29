import "../index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import AppProviders from "./providers";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
