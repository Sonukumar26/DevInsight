function SlowEndpoints({ endpoints = [] }) {

  return (

    <div
      style={{
        background: "#1e293b",
        padding: "1.5rem",
        borderRadius: "12px",
        marginBottom: "2rem",
        boxShadow:
          "0 4px 10px rgba(0,0,0,0.2)",
        color: "#cbd5e1"
      }}
    >

      <h3
        style={{
          marginBottom: "1rem"
        }}
      >
        ⚡ Slow Endpoints
      </h3>

      {endpoints.length === 0 ? (

        <p
          style={{
            opacity: 0.7
          }}
        >
          🚀 No slow endpoints detected
        </p>

      ) : (

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem"
          }}
        >

          {endpoints.map(
            (item, index) => (

              <div
                key={index}
                style={{
                  padding: "1rem",
                  background: "#0f172a",
                  borderRadius: "8px",
                  border:
                    "1px solid #334155"
                }}
              >

                <div
                  style={{
                    fontWeight: "bold",
                    color: "#38bdf8"
                  }}
                >
                  {item.endpoint}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "0.9rem",
                    color: "#94a3b8"
                  }}
                >
                  Average Response:
                  {" "}
                  <strong>
                    {item.avgTime} ms
                  </strong>
                </div>

                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#94a3b8"
                  }}
                >
                  Requests:
                  {" "}
                  <strong>
                    {item.count}
                  </strong>
                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}

export default SlowEndpoints;
