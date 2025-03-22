import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/_components/Nav";
import { Footer } from "@/_components/Footer";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider disableTransitionOnChange={true} defaultTheme="dark">
      <Nav />
      <Outlet />
      <Footer />
      {/* <TanStackRouterDevtools /> */}
    </ThemeProvider>
  ),
});
