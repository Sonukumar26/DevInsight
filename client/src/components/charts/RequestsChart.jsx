import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function RequestsChart({
  data,
  type = "apiCalls",
}) {

  const metrics = {
          apiCalls: {
            label: "API Requests",
            color: "#3b82f6",
            key: "apiCalls",
          },

          avgResponse: {
            label: "Response Time (ms)",
            color: "#22c55e",
            key: "avgResponse",
          },

          errors: {
            label: "Errors",
            color: "#ef4444",
            key: "errors",
          },
        };

  const current =
    metrics[type] ||
    metrics.apiCalls;

//    console.log(
//   "Timeline Data:",
//   data
// );
  return (

    <div style={styles.card}>

      <div style={styles.header}>

        <div>

          <h3 style={{ margin: 0 }}>
            📊 System Activity Overview
          </h3>

          <p style={styles.subtext}>
            {current.label}
          </p>

        </div>

        <span style={styles.live}>
          ● Live System
        </span>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
          />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip
            contentStyle={{
              backgroundColor:
                "#0f172a",
              border:
                "1px solid #334155",
              borderRadius:
                "10px",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey={current.key}
            stroke={current.color}
            strokeWidth={3}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

const styles = {
  card: {
    background:
      "linear-gradient(145deg,#1e293b,#0f172a)",
    padding: "1.5rem",
    borderRadius: "16px",
    border: "1px solid #334155",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.3)",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },

  subtext: {
    color: "#94a3b8",
    margin: 0,
  },

  live: {
    color: "#22c55e",
    fontSize: "0.8rem",
  },
};

export default RequestsChart;
