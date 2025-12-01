<<<<<<< HEAD
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { queryClient } from "./app/queryClient";
import "./index.css";
>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb

createRoot(document.getElementById("root")!).render(
  <StrictMode>
<<<<<<< HEAD
    <RouterProvider router={router} />
=======
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
  </StrictMode>
);
