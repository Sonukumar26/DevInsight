function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        flex: "1",
        minWidth: "220px",
        transition: "transform 0.2s",
        color: "#cbd5e1"
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
          opacity: 0.7,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginTop: "0.5rem",
          fontSize: "2rem",
          fontWeight: "600",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function SummaryCards({ data }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
      }}
    >
      <Card title="Total Requests" value={data.totalRequests} />

      <Card
        title="Avg Response Time (ms)"
        value={data.avgResponseTime}
      />

      <Card title="Error Rate (%)" value={data.errorRate} />
    </div>
  );
}

export default SummaryCards;