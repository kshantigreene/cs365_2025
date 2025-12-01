import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const navLinks = [
  { label: "Today", to: "/" },
  { label: "Meals", to: "/#meals" }
];

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="logo">
          <span className="logo-dot" />
          <div>
            <p className="logo-title">TC Dine Eval</p>
            <p className="logo-subtitle">Thomas Culinary Center</p>
          </div>
        </Link>
        <nav className="app-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} TC Dine Eval — Built for CS365.</p>
      </footer>
    </div>
  );
}



