import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav>
      <Link to="/" id="nav-logo">
        <img src="/metadata/icon.svg" alt="LOGO" /> <span>Sonata</span>
      </Link>
      <ul id="nav-links">
        <li>
          <Link to="/">Play</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
