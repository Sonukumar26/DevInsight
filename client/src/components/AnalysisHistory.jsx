import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});

  // -----------------------------
  // FETCH HISTORY
  // -----------------------------
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/analysis/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const deleteHistory = async (id) => {
    try {
      await api.delete(`/api/analysis/history/${id}`);
      setHistory((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // TOGGLE EXPAND
  // -----------------------------
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // -----------------------------
  // FILTER
  // -----------------------------
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch = item.repository
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchScore =
        scoreFilter === "ALL"
          ? true
          : scoreFilter === "HIGH"
          ? item.score >= 80
          : scoreFilter === "MEDIUM"
          ? item.score >= 50 && item.score < 80
          : item.score < 50;

      return matchSearch && matchScore;
    });
  }, [history, search, scoreFilter]);

  // -----------------------------
  // SCORE COLOR
  // -----------------------------
  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{ marginTop: "2rem", color: "#fff" }}>
      {/* HEADER */}
      <h2>📊 Analysis History</h2>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repository..."
          style={{
            flex: 1,
            padding: "0.8rem",
            borderRadius: "10px",
            background: "#0f172a",
            border: "1px solid #334155",
            color: "#fff",
          }}
        />

        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "10px",
            background: "#0f172a",
            color: "#fff",
            border: "1px solid #334155",
          }}
        >
          <option value="ALL">All Scores</option>
          <option value="HIGH">High (80+)</option>
          <option value="MEDIUM">Medium (50-79)</option>
          <option value="LOW">Low (&lt;50)</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && <p>Loading history...</p>}

      {/* EMPTY */}
      {!loading && filteredHistory.length === 0 && (
        <p>No analysis history found.</p>
      )}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {filteredHistory.map((item) => (
          <div
            key={item._id}
            style={{
              background: "#1e293b",
              padding: "1.2rem",
              borderRadius: "14px",
              border:
                item.score < 50
                  ? "1px solid #ef4444"
                  : "1px solid #334155",
              position: "relative",
              minHeight: "220px",
            }}
          >
            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteHistory(item._id)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Delete
            </button>

            {/* REPOSITORY */}
            <a
              href={item.repository}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#3b82f6",
                fontWeight: "bold",
                wordBreak: "break-word",
                display: "block",
                paddingRight: "70px",
              }}
            >
              {item.repository}
            </a>

            {/* SCORE */}
            <div style={{ marginTop: "0.7rem" }}>
              <b style={{ color: getScoreColor(item.score) }}>
                {item.score}/100
              </b>
            </div>

            {/* META */}
            <div
              style={{
                fontSize: "0.85rem",
                opacity: 0.8,
                marginTop: "0.3rem",
              }}
            >
              Issues: {item.issues?.length || 0}
            </div>

            {/* TOGGLE */}
            <button
              onClick={() => toggleExpand(item._id)}
              style={{
                marginTop: "1rem",
                background: "#0f172a",
                border: "1px solid #334155",
                padding: "0.5rem 0.8rem",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {expanded[item._id]
                ? "Hide Issues"
                : "View Issues"}
            </button>

            {/* ISSUES */}
            {expanded[item._id] && (
              <div style={{ marginTop: "1rem" }}>
                {item.issues?.slice(0, 3).map((issue, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#0f172a",
                      padding: "0.7rem",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <b style={{ color: "#fbbf24" }}>
                      {issue.type}
                    </b>
                    <p style={{ margin: 0 }}>
                      {issue.message}
                    </p>
                    {issue.file && (
                      <small style={{ opacity: 0.7 }}>
                        📄 {issue.file}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* DATE */}
            {item.createdAt && (
              <div
                style={{
                  marginTop: "0.8rem",
                  fontSize: "0.75rem",
                  opacity: 0.6,
                }}
              >
                {new Date(item.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalysisHistory;