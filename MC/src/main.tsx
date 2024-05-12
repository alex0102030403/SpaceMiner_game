import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes.tsx';
import LoginComponent from './Login.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginComponent />,
  },
  {
    path: '/app',
    element: <App />,
  },
  

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {/* <RouterProvider router={router}/> */}
  </React.StrictMode>,
)
