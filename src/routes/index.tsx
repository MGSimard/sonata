import { createFileRoute } from "@tanstack/react-router";
import { Piano } from "@/_components/Piano";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <main>
      <Piano />
    </main>
  );
}
