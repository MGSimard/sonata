import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Nav } from "@/_components/Nav";
import { Footer } from "@/_components/Footer";

export const Route = createRootRoute({
  component: () => (
    <>
      <Nav />
      <Outlet />
      <Footer />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
