import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Routes
import Index from "./routes/Index"


const router = createBrowserRouter([
  { path: '/', element: <Index /> },
  { path: '/1', element: <Index /> },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
