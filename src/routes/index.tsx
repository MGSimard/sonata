import { createFileRoute } from "@tanstack/react-router";
import { KeyTester } from "@/_components/KeyTester";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="App">
      App
      <KeyTester />
    </div>
  );
}
