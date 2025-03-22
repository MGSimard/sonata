import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav>
      <Link to="/" id="nav-logo">
        <img src="/metadata/icon.svg" alt="LOGO" /> <span>Sonata</span>
      </Link>
    </nav>
  );
}
