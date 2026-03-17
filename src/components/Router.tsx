import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import PageProductList from "../modules/product/PageProductList";

type TRouterProps = { children?: React.ReactNode };

const Router = ({ children }: TRouterProps) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          // element: <div></div>,
          children: [
            {
              path: "/",
              element: <PageProductList />,
            },
            {
              path: "/settings",
              element: <div></div>,
            },
          ],
        },
      ])}
    />
  );
};

export default Router;
