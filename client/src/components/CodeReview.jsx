import api from "../api/axios";
import { useState, useMemo, useEffect } from "react";
function CodeReview() {
  const [repoUrl, setRepoUrl] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("All");
  const [openFiles, setOpenFiles] = useState({});
  useEffect(() => {
  console.log("Review Data:", review);
}, [review]);

  // -------------------------
  // ANALYZE REPO
  // -------------------------
  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;

    setLoading(true);
    setReview(null);

    try {
      const res = await api.post("/api/code-review/review", {
        repoUrl,
      });

      setReview(res.data);
    } catch (err) {
      setReview({
        error:
          err?.response?.data?.error ||
          "Failed to analyze repository",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // TOGGLE FILE VIEW
  // -------------------------
  const toggleFile = (file) => {
    setOpenFiles((prev) => ({
      ...prev,
      [file]: !prev[file],
    }));
  };

  // -------------------------
  // FILTER ISSUES
  // -------------------------
  const filteredIssues = useMemo(() => {
    if (!review?.issues) return [];

    return review.issues.filter(
      (i) => filter === "All" || i.type === filter
    );
  }, [review, filter]);

  // -------------------------
  // GROUP ISSUES BY FILE
  // -------------------------
  const grouped = useMemo(() => {
    const map = {};

    filteredIssues.forEach((issue) => {
      if (!map[issue.file]) map[issue.file] = [];
      map[issue.file].push(issue);
    });

    return map;
  }, [filteredIssues]);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem",
        background: "#0f172a",
        color: "#e2e8f0",
        borderRadius: "16px",
      }}
    >
      {/* HEADER */}
      <h1 style={{ marginBottom: "1rem" }}>
        🔍 AI Code Review Dashboard
      </h1>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
          style={{
            flex: 1,
            padding: "0.9rem",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#020617",
            color: "#fff",
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "0.9rem 1.2rem",
            borderRadius: "10px",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* ERROR */}
      {review?.error && (
        <div
          style={{
            marginTop: "1rem",
            background: "#7f1d1d",
            padding: "1rem",
            borderRadius: "10px",
          }}
        >
          {review.error}
        </div>
      )}

      {/* SCORE DASHBOARD */}
      {review?.score !== undefined && (
        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={cardStyle}>
            <h4>Score</h4>
            <h2 style={{ color: "#22c55e" }}>
              {review.score}/100
            </h2>
          </div>

          <div style={cardStyle}>
            <h4>Files Analyzed</h4>
            <h2>{review.filesAnalyzed?.length || 0}</h2>
          </div>

          <div style={cardStyle}>
            <h4>Total Issues</h4>
            <h2>{review.issues?.length || 0}</h2>
          </div>
        </div>
      )}

      {/* FILES ANALYZED */}
      {review?.filesAnalyzed?.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📁 Files Scanned</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {review.filesAnalyzed.map((file, i) => (
              <div key={i} style={fileCard}>
                📄 {file}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      {review?.issues?.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {["All", "Security", "Bug", "Style", "Performance"].map(
            (t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  background:
                    filter === t ? "#3b82f6" : "#1e293b",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            )
          )}
        </div>
      )}

      {/* ISSUES */}
      <div style={{ marginTop: "2rem" }}>
        <h3>🚨 Issues Found</h3>

        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([file, issues]) => (
            <div key={file} style={issueBlock}>
              {/* FILE HEADER */}
              <div
                onClick={() => toggleFile(file)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <b>📄 {file}</b>
                <span style={{ color: "#f59e0b" }}>
                  {issues.length} issues
                </span>
              </div>

              {/* ISSUES */}
              {openFiles[file] && (
                <div style={{ marginTop: "0.8rem" }}>
                  {issues.map((i, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "0.6rem",
                        background: "#0f172a",
                        borderRadius: "8px",
                        marginTop: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          color:
                            i.type === "Security"
                              ? "#ef4444"
                              : i.type === "Bug"
                              ? "#f59e0b"
                              : "#60a5fa",
                        }}
                      >
                        {i.type}
                      </span>
                      <p style={{ margin: 0 }}>{i.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* AI REVIEWS */}
                {review?.aiReviews?.length > 0 && (
                  <div style={{ marginTop: "2rem" }}>
                    <h3>🤖 AI Review</h3>

                    {review.aiReviews.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          background: "#1e293b",
                          padding: "1rem",
                          borderRadius: "12px",
                          marginBottom: "1rem",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word"
                        }}
                      >
                        <h4>
                          File #{index + 1}
                        </h4>

                        <p
                          style={{
                            color: "#cbd5e1",
                            marginTop: "10px"
                          }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))
        ) : (
          <p style={{ color: "#94a3b8" }}>
            No issues found 🎉
          </p>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ marginTop: "2rem", color: "#94a3b8" }}>
          Analyzing repository...
        </div>
      )}
    </div>
  );
}

// -------------------------
// STYLES
// -------------------------
const cardStyle = {
  background: "#1e293b",
  padding: "1rem",
  borderRadius: "12px",
};

const fileCard = {
  background: "#1e293b",
  padding: "0.7rem",
  borderRadius: "8px",
  fontSize: "13px",
};

const issueBlock = {
  background: "#1e293b",
  padding: "1rem",
  borderRadius: "12px",
  marginBottom: "1rem",
};

export default CodeReview;