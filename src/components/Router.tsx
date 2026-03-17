import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AuthProvider } from "../context/AuthContext";
import { AppLayout } from "./AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const PageLogin = lazy(() => import("../modules/auth/PageLogin"));
const PageProductList = lazy(() => import("../modules/product/PageProductList"));
const PageProductDetail = lazy(() => import("../modules/product/PageProductDetail"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" aria-label="Loading" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageFallback />}>
        <PageLogin />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Suspense fallback={<PageFallback />}>
            <PageProductList />
          </Suspense>
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Suspense fallback={<PageFallback />}>
            <PageProductDetail />
          </Suspense>
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
