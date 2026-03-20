import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/runs", label: "Run Inbox" },
  {
    to: "/compare?pair=phase0-validator-run-005__phase0-review-run-001",
    label: "Comparison",
  },
  { to: "/feedback", label: "Feedback Queue" },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">SaleCheckUp Signals Radar</p>
          <h1>Operator UI Demo Wave v0</h1>
          <p className="hero-copy">
            Internal single-user local demo. No backend. No auth. No runtime or
            governance mutation path.
          </p>
        </div>
        <div className="honesty-card">
          <h2>Honesty note</h2>
          <p>
            This surface uses normalized demo read models stitched from tracked
            artifacts, draft outcome captures, and local demo data. Uncertainty
            stays visible.
          </p>
        </div>
      </header>

      <nav className="app-nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link${isActive ? " is-active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
