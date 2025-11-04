import { Loading } from "@/components/loading";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutComponent,
});

export default function DashboardLayoutComponent() {
  const routerState = useRouterState();
  const [loading, setIsLoading] = useState(true);
  const pathname = routerState.location.pathname;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const noLayoutRoutes: string[] = [];
  const noLayoutPrefixRoutes: string[] = [
    "/dashboard/boards/create",
    "/dashboard/boards/",
    "/dashboard/notes/create",
  ];

  const isSetupPage = pathname.endsWith("/setup");

  const isNoLayoutRoute =
    noLayoutRoutes.includes(pathname) ||
    noLayoutPrefixRoutes.some((prefix) => pathname.startsWith(prefix)) ||
    isSetupPage;

  if (isNoLayoutRoute) {
    return (
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    );
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <Suspense fallback={<Loading />}>
        <SidebarProvider className="flex flex-col">
          <AppHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col p-4 lg:p-8 bg-background">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </Suspense>
    </div>
  );
}
