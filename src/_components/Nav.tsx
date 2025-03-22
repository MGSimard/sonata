import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { IconSunSolid, IconSunOutline, IconInfo } from "@/_components/Icons";

export function Nav() {
  const { theme, setTheme } = useTheme();

  return (
    <nav>
      <Link to="/" id="nav-logo">
        <img src="/metadata/icon.svg" alt="LOGO" /> <span>Sonata</span>
      </Link>
      <div id="nav-controls">
        <button type="button" aria-label="About" title="About">
          <IconInfo />
        </button>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark" ? <IconSunOutline /> : <IconSunSolid />}
        </button>
      </div>
    </nav>
  );
}
