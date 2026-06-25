import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import api from "./api/axios";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import SummaryCards from "./components/SummaryCards";
import SlowEndpoints from "./components/SlowEndpoints";
import SuggestionsPanel from "./components/SuggestionsPanel";

import RequestsChart from "./components/charts/RequestsChart";
import ErrorChart from "./components/charts/ErrorChart";

import CodeReview from "./components/CodeReview";
import AnalysisHistory from "./components/AnalysisHistory";

import AnalysisStats from "./components/AnalysisStats";

function App() {

  const [data, setData] = useState({
    totalRequests: 0,
    avgResponseTime: 0,
    errorRate: 0,
    slowEndpoints: [],
    suggestions: []
  });

  const [timeline, setTimeline] = useState([]);
 const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  const [chartType, setChartType] =
  useState("apiCalls");

  const [analysisStats, setAnalysisStats] =
  useState({
    totalRepositories: 0,
    averageScore: 0,
    totalIssues: 0
  });

  useEffect(() => {

    fetchSummary();
    fetchTimeline(range);

    const interval = setInterval(() => {

      fetchSummary();
      fetchTimeline(range);
      fetchAnalysisStats();

    }, 5000);

    return () => clearInterval(interval);

  }, [range]);

  const fetchSummary = async () => {

    try {

      const res =
        await api.get(
          "/api/metrics/summary"
        );

      setData(res.data);

    } catch (err) {

      console.error(
        "Summary Error:",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  const fetchTimeline = async (
    selectedRange
  ) => {

    try {

      const res =
        await api.get(
          `/api/metrics/timeline?range=${selectedRange}`
        );

      setTimeline(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Timeline Error:",
        err
      );

      setTimeline([]);

    }

  };

  const fetchAnalysisStats =
  async () => {

    try {

      const res =
        await api.get(
          "/api/analysis/stats"
        );

      setAnalysisStats(
        res.data
      );

    } catch (err) {

      console.error(
        "Analysis Stats Error:",
        err
      );

    }

  };

  return (

    <BrowserRouter>

      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          padding: "2rem",
          minHeight: "100vh",
          background: "#0f172a",
          color: "#fff"
        }}
      >

        <Navbar />

        {loading && (
          <h3>
            Loading Dashboard...
          </h3>
        )}

        <Routes>

          <Route
            path="/"
            element={

              <>

              <AnalysisStats
                stats={analysisStats}
              />
                <SummaryCards
                  data={data}
                />

                {/* Time Range */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    marginBottom: "20px"
                  }}
                >

                  <button
                    onClick={() =>
                      setRange("1h")
                    }
                  >
                    1H
                  </button>

                  <button
                    onClick={() =>
                      setRange("24h")
                    }
                  >
                    24H
                  </button>

                  <button
                    onClick={() =>
                      setRange("7d")
                    }
                  >
                    7D
                  </button>

                </div>

                {/* Activity Filters */}

                <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "20px"
                    }}
                  >

                    <button
                      onClick={() =>
                        setChartType("apiCalls")
                      }
                    >
                      API Requests
                    </button>

                    <button
                      onClick={() =>
                        setChartType("avgResponse")
                      }
                    >
                      Response Time
                    </button>

                    <button
                      onClick={() =>
                        setChartType("errors")
                      }
                    >
                      Errors
                    </button>

                  </div>
                <RequestsChart
                  data={timeline}
                  type={chartType}
                />

               <ErrorChart
                  successCount={
                    data.successCount
                  }

                  clientErrors={
                    data.clientErrors
                  }

                  serverErrors={
                    data.serverErrors
                  }
               />

                <SlowEndpoints
                  endpoints={
                    data.slowEndpoints || []
                  }
                />

                <SuggestionsPanel
                  suggestions={
                    data.suggestions || []
                  }
                />

              </>

            }
          />

          <Route
            path="/code-review"
            element={
              <CodeReview />
            }
          />

          <Route
            path="/history"
            element={
              <AnalysisHistory />
            }
          />

        </Routes>

      </div>

    </BrowserRouter>

  );

}

export default App;
