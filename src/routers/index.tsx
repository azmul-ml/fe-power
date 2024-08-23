import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FullScreenLoader from "@/components/spinner/Spinner";
import PageLayout from "@/layout/Layout";
// import PageLayout from "@/components/page-layout/PageLayout";
import RequireAuth from "@/routers/private/RequireAuth";
import ProtectedRoute from "@/routers/private/PrivateRouteRender";
import PublicRoute from "@/routers/public/PublicRouteRender";
import { PRIVATE_ROUTERS } from "./private";
import { PUBLIC_ROUTERS } from "./public";
import * as RouterType from "@/routers/type";
import NotFoundPage from "@/pages/not-found/page";

export default function Routers() {
  return (
    <React.Suspense fallback={<FullScreenLoader />}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<PageLayout />}>
            <Route element={<RequireAuth />}>
              {Object.values(PRIVATE_ROUTERS).map(
                (route: RouterType.RouteItemType) => {
                  const Component = route.component as any;
                  return (
                    <Route
                      path={route.path ?? "/"}
                      key={route.title}
                      element={
                        <ProtectedRoute
                          required={route.permissions ?? []}
                          hasAll={route.hasAll}
                        >
                          <Component />
                        </ProtectedRoute>
                      }
                    />
                  );
                }
              )}
            </Route>
          </Route>

          <Route element={<PublicRoute />}>
            {Object.values(PUBLIC_ROUTERS).map(
              (route: RouterType.RouteItemType) => {
                const Component = route.component as any;
                return (
                  <Route
                    key={route.title}
                    path={route.path}
                    element={<Component />}
                  />
                );
              }
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}
