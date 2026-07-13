function AnalysisStats({ stats }) {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "20px",
        marginBottom: "20px"
      }}
    >

      <div style={card}>
        <h3>📦 Repositories</h3>
        <h1>{stats.totalRepositories}</h1>
      </div>

      <div style={card}>
        <h3>⭐ Average Score</h3>
        <h1>{stats.averageScore}</h1>
      </div>

      <div style={card}>
        <h3>🐞 Issues Found</h3>
        <h1>{stats.totalIssues}</h1>
      </div>

    </div>

  );

}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  color: "#fff"
};

export default AnalysisStats;