import React from "react";
import ReactDOM from "react-dom/client";

import { ClerkProvider } from "./components/common/MockAuth";

import "./index.css";
import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <ClerkProvider>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);