import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add error boundary and proper initialization
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Failed to render React app:", error);
  // Fallback content
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Loading...</h1>
      <p>If this message persists, please refresh the page.</p>
    </div>
  `;
}
