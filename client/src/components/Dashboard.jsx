import { useState } from "react";
import SummaryCards from "../components/SummaryCards";
import RequestsChart from "../components/charts/RequestsChart";
import ErrorChart from "../components/charts/ErrorChart";
import SlowEndpoints from "../components/SlowEndpoints";
import SuggestionsPanel from "../components/SuggestionsPanel";

function Dashboard({ data, timeline = [], history = [], setRange }) {
  const [activeRange, setActiveRange] = useState("24h");

  const handleRange = (range) => {
    setActiveRange(range);
    setRange(range);
  };

  const ranges = ["1h", "24h", "7d"];

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>⚡ DevInsight</h1>
          <p style={styles.subtitle}>
            Real-time API intelligence with predictive insights
          </p>
        </div>

        {/* KPI */}
        <div style={styles.glassCard}>
          <SummaryCards data={data} />
        </div>

        {/* TIME RANGE */}
        <div style={styles.stickyBar}>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => handleRange(r)}
              style={{
                ...styles.rangeBtn,
                background:
                  activeRange === r
                    ? "linear-gradient(135deg,#6366f1,#3b82f6)"
                    : "rgba(255,255,255,0.05)",
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CHARTS */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>📈 Requests Flow</h3>

            {/* FIX: ensure data exists */}
            <RequestsChart data={timeline} />
          </div>

          <div style={styles.card}>
            <h3>⚠️ Error Heat</h3>

            {/* FIX: pass correct prop */}
            <ErrorChart history={history} />
          </div>
        </div>

        {/* INSIGHTS */}
        <div style={styles.grid}>
          <div style={styles.cardAccent}>
            <h3>🐢 Slow Endpoints</h3>
            <SlowEndpoints endpoints={data?.slowEndpoints || []} />
          </div>

          <div style={styles.cardAccent}>
            <h3>🧠 AI Suggestions</h3>
            <SuggestionsPanel suggestions={data?.suggestions || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------
const styles = {
  bg: {
    minHeight: "100vh",
    padding: "2rem",
    color: "#e2e8f0",
    background:
      "radial-gradient(circle at 20% 20%, #1e3a8a 0%, transparent 40%), radial-gradient(circle at 80% 30%, #7c3aed 0%, transparent 45%), radial-gradient(circle at 50% 80%, #0ea5e9 0%, transparent 40%), #0f172a",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "2rem",
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg,#60a5fa,#a78bfa,#22d3ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    opacity: 0.7,
  },

  glassCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },

  stickyBar: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
  },

  rangeBtn: {
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "1.5rem",
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    padding: "1.5rem",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cardAccent: {
    background:
      "linear-gradient(145deg, rgba(99,102,241,0.1), rgba(14,165,233,0.08))",
    padding: "1.5rem",
    borderRadius: "16px",
  },
};

export default Dashboard;