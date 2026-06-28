function ErrorChart({

  successCount = 0,

  clientErrors = 0,

  serverErrors = 0

}) {

  const total =
    successCount +
    clientErrors +
    serverErrors;

  const successPercent =
    total
      ? (
          (successCount / total) *
          100
        ).toFixed(2)
      : 0;

  const clientPercent =
    total
      ? (
          (clientErrors / total) *
          100
        ).toFixed(2)
      : 0;

  const serverPercent =
    total
      ? (
          (serverErrors / total) *
          100
        ).toFixed(2)
      : 0;

  return (

    <div
      style={{
        background: "#172033",
        padding: "24px",
        borderRadius: "16px",
        marginTop: "20px"
      }}
    >

      <h2>
        ⚠️ Error Distribution
      </h2>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "40px",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "20px"
        }}
      >

        <div
          style={{
            width: `${successPercent}%`,
            background: "#22c55e"
          }}
        />

        <div
          style={{
            width: `${clientPercent}%`,
            background: "#f59e0b"
          }}
        />

        <div
          style={{
            width: `${serverPercent}%`,
            background: "#ef4444"
          }}
        />

      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >

        <div>
          🟢 Success Requests:
          {" "}
          {successCount}
          {" "}
          ({successPercent}%)
        </div>

        <div>
          🟠 Client Errors (4xx):
          {" "}
          {clientErrors}
          {" "}
          ({clientPercent}%)
        </div>

        <div>
          🔴 Server Errors (5xx):
          {" "}
          {serverErrors}
          {" "}
          ({serverPercent}%)
        </div>

      </div>

    </div>

  );

}

export default ErrorChart;