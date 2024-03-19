import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Routes
import App from "./routes/App";
import Home from "./routes/Home";
import About from './routes/About';
import Portfolio from './routes/Portfolio';
import Contact from './routes/Contact';

import Blog from './routes/Blog';
import PostContainer from "./components/Blog/PostContainer";

import ErrorPage from "./routes/ErrorPage";


const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />,
    children: [
      {index: true, element: <Home /> },
      {path: "about", element: <About />},
      {path: "portfolio", element: <Portfolio />},
      {
        path: "blog", 
        element: <Blog />,
        children: [
          {index: true, element: <PostContainer />},
          {path: 'posts', element: <PostContainer />},
          {path: 'post/:pid', element: <PostContainer />}
        ]
      },
      {path: "contact", element: <Contact />},
      {path: "error", element: <ErrorPage />}
    ],
    errorElement: <Navigate to="/error" />
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
