import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/code-review", label: "Code Review", icon: "🧠" },
    { path: "/history", label: "History", icon: "📁" },
  ];

  return (
    <div style={styles.sidebar}>
      {/* BRAND */}
      <div style={styles.brand}>
        <div style={styles.logo}>⚡</div>
        <div>
          <h2 style={{ margin: 0 }}>DevInsight</h2>
          <p style={styles.tagline}>AI Dev Analytics</p>
        </div>
      </div>

      <div style={styles.divider} />

      {/* NAV */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                background: active
                  ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                  : "transparent",
                boxShadow: active
                  ? "0 0 20px rgba(59,130,246,0.4)"
                  : "none",
                transform: active ? "scale(1.03)" : "scale(1)",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div style={styles.footer}>
        <div style={styles.statusDot} />
        <span>System Online</span>
      </div>
    </div>
  );
}

// ----------------------
// STYLES (MODERN UI)
// ----------------------
const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    padding: "1.5rem",
    color: "#fff",

    background:
      "linear-gradient(180deg, rgba(17,24,39,0.95), rgba(15,23,42,0.98))",
    backdropFilter: "blur(12px)",

    borderRight: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "10px 0 40px rgba(0,0,0,0.4)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "1rem",
  },

  logo: {
    fontSize: "1.5rem",
    background: "linear-gradient(135deg,#3b82f6,#a855f7)",
    padding: "8px",
    borderRadius: "10px",
  },

  tagline: {
    margin: 0,
    fontSize: "0.75rem",
    opacity: 0.6,
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "1rem 0",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },

  link: {
    display: "flex",
    alignItems: "center",
    padding: "0.7rem 0.8rem",
    borderRadius: "10px",
    color: "#fff",
    textDecoration: "none",
    transition: "0.2s ease",
  },

  footer: {
    position: "absolute",
    bottom: "20px",
    left: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    opacity: 0.7,
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 10px #22c55e",
  },
};

export default Sidebar;