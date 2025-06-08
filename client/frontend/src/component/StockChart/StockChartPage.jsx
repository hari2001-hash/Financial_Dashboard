

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

// You must get your own API key from https://www.alphavantage.co/support/#api-key
const API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY"; // <-- Replace this!
const SYMBOL = "RELIANCE.BSE";

export default function RelianceCandleApex() {
  const [series, setSeries] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${SYMBOL}&outputsize=compact&apikey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data["Error Message"]) {
          setError("API returned error: Invalid symbol or API error.");
          setLoading(false);
          return;
        }
        if (data["Note"]) {
          setError("API call frequency exceeded. Please wait and try again.");
          setLoading(false);
          return;
        }
        if (!data["Time Series (Daily)"]) {
          setError("No data available from API.");
          setLoading(false);
          return;
        }

        const rawSeries = data["Time Series (Daily)"];
        setLastRefreshed(data["Meta Data"]["3. Last Refreshed"]);

        // Transform to Apex format: { x: Date, y: [open, high, low, close] }
        const transformed = Object.entries(rawSeries)
          .map(([date, values]) => ({
            x: new Date(date),
            y: [
              parseFloat(values["1. open"]),
              parseFloat(values["2. high"]),
              parseFloat(values["3. low"]),
              parseFloat(values["4. close"])
            ]
          }))
          .sort((a, b) => a.x - b.x); // Oldest to newest

        setSeries([{ data: transformed }]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data from Alpha Vantage.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const options = {
    chart: {
      type: 'candlestick',
      height: 500,
      toolbar: { show: true }
    },
    title: {
      text: 'Reliance Industries (RELIANCE.BSE) - Candlestick Chart',
      align: 'center'
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false }
    },
    yaxis: {
      tooltip: { enabled: true },
      title: { text: 'Price (INR)' }
    },
    noData: {
      text: loading ? "Loading..." : "No data"
    }
  };

  return (
    <div style={{
      maxWidth: 950,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 10,
      padding: 20,
      boxShadow: "0 3px 12px #0001"
    }}>
      {error && (
        <div style={{ color: "red", textAlign: "center", margin: 16 }}>{error}</div>
      )}
      <Chart options={options} series={series} type="candlestick" height={500} />
      {lastRefreshed && (
        <div style={{ fontSize: 12, color: "#666", marginTop: 8, textAlign: "center" }}>
          Data source: Alpha Vantage, Last Refreshed: {lastRefreshed}
        </div>
      )}
    </div>
  );
}