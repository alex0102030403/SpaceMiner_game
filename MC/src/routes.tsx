
import React from "react";

import { RouteObject, createBrowserRouter } from "react-router-dom";


const LoginComponent = React.lazy(() => import("./Login"));
const App = React.lazy(() => import("./App"));


export const routes: RouteObject[] = [
    {
        path: "/",
        element: <LoginComponent />,
        
        children: [     
            {
                path: "/",
                element: <LoginComponent />,
            },
            {
                path: "app",
                element: <App />
            },
        ]
    }
]

export const router = createBrowserRouter(routes);