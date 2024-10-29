import { useRef } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import { RouterProvider } from "react-router-dom";

export default function App() {
    const router = useRef(createBrowserRouter([
        {
            path: "/",
            children: [
                {
                    path: "/",
                    element: <Home />
                }
            ]
        }
    ]))

    return <RouterProvider router={router.current} />
}