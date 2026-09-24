import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeMarketingScripts } from "@/lib/marketing";

initializeMarketingScripts();

createRoot(document.getElementById("root")!).render(<App />);
