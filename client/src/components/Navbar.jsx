import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const titles = {
    "/": "Dashboard",
    "/code-review": "AI Code Review",
    "/history": "Analysis History",
  };

  const title = titles[location.pathname] || "DevInsight";

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <div style={styles.dot} />
        <h2 style={styles.title}>{title}</h2>
      </div>

      <div style={styles.right}>
        <span style={styles.status}>
          ● Live
        </span>
      </div>
    </div>
  );
}

// ----------------------
// STYLES
// ----------------------
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    marginBottom: "2rem",

    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",

    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#22c55e)",
    boxShadow: "0 0 12px rgba(59,130,246,0.6)",
  },

  title: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: "600",
    background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  status: {
    fontSize: "0.8rem",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.1)",
    color: "#22c55e",
    border: "1px solid rgba(34,197,94,0.3)",
    boxShadow: "0 0 10px rgba(34,197,94,0.15)",
  },
};

export default Navbar;