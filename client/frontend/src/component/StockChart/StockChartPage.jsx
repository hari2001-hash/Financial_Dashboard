import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

// ---- Live Price Component ----
function StockLivePrice({ symbol, apiKey }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
      .then((res) => res.json())
      .then((data) => setPrice(data.c));
  }, [symbol, apiKey]);

  return (
    <div style={{ marginBottom: 20 }}>
      {price !== null ? (
        <h2>
          {symbol} Live Price: ${price.toFixed(2)}
        </h2>
      ) : (
        <div>Loading price...</div>
      )}
    </div>
  );
}

// ---- Chart Component ----
function StockChart({ symbol, apiKey }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const monthAgo = now - 30 * 24 * 60 * 60;
    console.log("now"+now);
   console.log("monthAgo"+monthAgo);

    
    fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${monthAgo}&to=${now}&token=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.s === "ok") {
          setChartData({
            labels: data.t.map((ts) =>
              new Date(ts * 1000).toLocaleDateString()
            ),
            datasets: [
              {
                label: `${symbol} Close Price`,
                data: data.c,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          });
        }
      });
  }, [symbol, apiKey]);

  return chartData ? (
    <Line data={chartData} />
  ) : (
    <div>Loading chart...</div>
  );
}

// ---- Insights Card ----
function Insights() {
  // Example insights
  const insights = {
    topMovers: [
      { symbol: "AAPL", name: "Apple", change: "+2.31%" },
      { symbol: "TSLA", name: "Tesla", change: "+4.10%" },
      { symbol: "NVDA", name: "Nvidia", change: "-1.24%" },
    ],
    marketSummary: {
      SENSEX: "+0.88%",
      NIFTY: "+0.73%",
      NASDAQ: "-0.11%",
      DOW: "+0.29%",
    },
    trends: [
      "AI stocks outperforming",
      "Banking sector recovery",
      "EV stocks gaining traction",
    ],
  };

  return (
    <div className="insights-section" style={{ marginTop: 30 }}>
      <div className="insight-card">
        <h3>Top Movers</h3>
        <ul>
          {insights.topMovers.map((stock) => (
            <li key={stock.symbol}>
              <span className="stock-symbol">{stock.symbol}</span>
              <span className="stock-name">{stock.name}</span>
              <span
                className={
                  "stock-change " +
                  (stock.change.startsWith("+") ? "up" : "down")
                }
              >
                {stock.change}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="insight-card">
        <h3>Market Summary</h3>
        <ul className="market-summary">
          {Object.entries(insights.marketSummary).map(([idx, val]) => (
            <li key={idx}>
              <span className="index-name">{idx}</span>
              <span
                className={
                  "index-change " +
                  (val.startsWith("+") ? "up" : "down")
                }
              >
                {val}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="insight-card">
        <h3>Trends</h3>
        <ul>
          {insights.trends.map((trend, i) => (
            <li key={i}>• {trend}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function StockChartPage() {
  const FINNHUB_API_KEY = "fgdxgfdgfhtfgxj"; // Your Finnhub key
  const SYMBOL = "AAPL";

  return (
    <div className="stock-news-bg">
      <div className="stock-news-container">
        <h1 className="stock-news-title">Stock Chart & Insights</h1>
        <div className="stock-chart-section">
          <StockLivePrice symbol={SYMBOL} apiKey={FINNHUB_API_KEY} />
          <StockChart symbol={SYMBOL} apiKey={FINNHUB_API_KEY} />
        </div>
        <Insights />
      </div>
    </div>
  );
}