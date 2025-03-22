import { Link } from "@tanstack/react-router";
import { InfoButton } from "@/_components/InfoButton";
import { ThemeToggle } from "@/_components/ThemeToggle";
export function Nav() {
  return (
    <nav>
      <Link to="/" id="nav-logo">
        <img src="/metadata/icon.svg" alt="LOGO" /> <span>Sonata</span>
      </Link>
      <div id="nav-controls">
        <InfoButton />
        <ThemeToggle />
      </div>
    </nav>
  );
}
