import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Routes
import App from "./routes/App";
import Home from "./routes/Home";
import About from './routes/About';
import Portfolio from './routes/Portfolio';
import Blog from './routes/Blog';
import Contact from './routes/Contact';




const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />,
    children: [
      {index: true, element: <Home /> },
      {path: "about", element: <About />},
      {path: "portfolio", element: <Portfolio />},
      {path: "blog", element: <Blog />},
      {path: "contact", element: <Contact />}
    ]
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
