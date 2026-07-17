function SuggestionsPanel({ suggestions }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        color: "#cbd5e1"
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>AI Suggestions</h3>

      {suggestions.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No suggestions available.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {suggestions.map((s, index) => (
            <div
              key={index}
              style={{
                background: "#0f172a",
                padding: "0.7rem 0.9rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                fontSize: "0.9rem",
                color: "#cbd5e1"
              }}
            >
              💡 {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestionsPanel;