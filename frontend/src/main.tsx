import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.tsx'
import ErrorPage from './pages/ErrorPage.tsx';
import Index, { loader as indexLoader } from './pages/Index/Index.tsx';
import Login from './pages/Login/Login.tsx';
import StockDetail, { loader as stockDetailLoader } from './pages/StockDetail/StockDetail.tsx';
import StockReport, { loader as stockReportLoader } from './pages/StockReport/StockReport.tsx';
import SavedReport from './pages/SavedReport/SavedReport.tsx';

const router = createBrowserRouter([
  {
    // Default Path
    path: "/",
    // Navigation Bar
    element: <App />,
    // When access url that not exist, it will occur.
    errorElement: <ErrorPage />,
    // loader: rootLoader,
    children: [
      {
        // Relative Path
        path: "",
        element: <Index />,
        loader: indexLoader
      },
      {
        // http://localhost:5173/Login
        path: "Login",
        element: <Login />,
      },
      {
        // http://localhost:5173/StockDetail/AAPL
        path: "StockDetail/:tickerSymbol",
        element: <StockDetail />,
        loader: stockDetailLoader
      },
      {
        path: "StockDetail/:tickerSymbol/report",
        element: <StockReport />,
        loader: stockReportLoader
      },
      {
        path: "SavedReport",
        element: <SavedReport />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
