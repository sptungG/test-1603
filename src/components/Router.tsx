import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AuthProvider } from "../context/AuthContext";
import PageLogin from "../modules/auth/PageLogin";
import PageProductDetail from "../modules/product/PageProductDetail";
import PageProductList from "../modules/product/PageProductList";
import { AppLayout } from "./AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PageLogin />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PageProductList />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PageProductDetail />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex items-center justify-center min-h-64 text-gray-400">
            <p>Page not found</p>
          </div>
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);

const Router = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default Router;
