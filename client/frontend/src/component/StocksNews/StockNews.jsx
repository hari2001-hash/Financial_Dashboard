


// import React, { useState, useEffect } from "react";
// import "./StockNews.css";

// // Helper for formatting time
// function formatTime(iso) {
//   const date = new Date(iso);
//   return date.toLocaleString();
// }

// export default function StockNews() {
//   const [activeTab, setActiveTab] = useState("news");
// const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   // Replace with your own key from https://financialmodelingprep.com/developer/docs/
//   const API_KEY = "QWJi94K1ZDFWKqY0pS5FiWOFh58y9nSu";


//   useEffect(() => {
//   setLoading(true);
//   setErr(null);
//   fetch(`https://newsapi.org/v2/everything?q=stock%20market&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data); // See what you get!
//       if (Array.isArray(data)) {
//         setNews(data);
//       } else {
//         setNews([]);
//         setErr("Unexpected response from news API.");
//       }
//       setLoading(false);
//     })
//     .catch((error) => {
//       setErr("Failed to fetch news.");
//       setNews([]);
//       setLoading(false);
//     });
// }, []);
// //   useEffect(() => {
// //     setLoading(true);
// //     setErr(null);
// //     fetch(`https://financialmodelingprep.com/api/v3/stock_news?limit=10&apikey=${API_KEY}`)
// //       .then((res) => res.json())
// //       .then((data) => {
// //         setNews(data);
// //         setLoading(false);
// //       })
// //       .catch((error) => {
// //         setErr("Failed to fetch news.");
// //         setLoading(false);
// //       });
// //   }, []);

//   // Example insights (can be replaced with API content)
//   const insights = {
//     topMovers: [
//       { symbol: "AAPL", name: "Apple", change: "+2.31%" },
//       { symbol: "TSLA", name: "Tesla", change: "+4.10%" },
//       { symbol: "NVDA", name: "Nvidia", change: "-1.24%" }
//     ],
//     marketSummary: {
//       SENSEX: "+0.88%",
//       NIFTY: "+0.73%",
//       NASDAQ: "-0.11%",
//       DOW: "+0.29%"
//     },
//     trends: [
//       "AI stocks outperforming",
//       "Banking sector recovery",
//       "EV stocks gaining traction"
//     ]
//   };

//   return (
//     <div className="stock-news-bg">
//       <div className="stock-news-container">
//         <h1 className="stock-news-title">Stock Market News & Insights</h1>
//         <div className="stock-news-tabs">
//           <button
//             className={activeTab === "news" ? "active" : ""}
//             onClick={() => setActiveTab("news")}
//           >
//             News Headlines
//           </button>
//           <button
//             className={activeTab === "insights" ? "active" : ""}
//             onClick={() => setActiveTab("insights")}
//           >
//             Insights
//           </button>
//         </div>

//         {activeTab === "news" ? (
//           loading ? (
//             <div className="news-loading">Loading news...</div>
//           ) : err ? (
//             <div className="news-error">{err}</div>
//           ) : (
//             <div className="news-list">
//               {news.map((n) => (
//                 <a
//                   key={n.url}
//                   className="news-card"
//                   href={n.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {n.image && (
//                     <div className="news-image-wrapper">
//                       <img src={n.image} alt={n.title} className="news-image" />
//                     </div>
//                   )}
//                   <div className="news-meta">
//                     <span className="news-source">{n.site}</span>
//                     <span className="news-date">{formatTime(n.publishedDate)}</span>
//                   </div>
//                   <div className="news-title">{n.title}</div>
//                   <div className="news-summary">
//                     {n.text.length > 160 ? n.text.slice(0, 160) + "..." : n.text}
//                   </div>
//                 </a>
//               ))}
//             </div>
//           )
//         ) : (
//           <div className="insights-section">
//             <div className="insight-card">
//               <h3>Top Movers</h3>
//               <ul>
//                 {insights.topMovers.map((stock) => (
//                   <li key={stock.symbol}>
//                     <span className="stock-symbol">{stock.symbol}</span>
//                     <span className="stock-name">{stock.name}</span>
//                     <span
//                       className={
//                         "stock-change " +
//                         (stock.change.startsWith("+") ? "up" : "down")
//                       }
//                     >
//                       {stock.change}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="insight-card">
//               <h3>Market Summary</h3>
//               <ul className="market-summary">
//                 {Object.entries(insights.marketSummary).map(([idx, val]) => (
//                   <li key={idx}>
//                     <span className="index-name">{idx}</span>
//                     <span
//                       className={
//                         "index-change " +
//                         (val.startsWith("+") ? "up" : "down")
//                       }
//                     >
//                       {val}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="insight-card">
//               <h3>Trends</h3>
//               <ul>
//                 {insights.trends.map((trend, i) => (
//                   <li key={i}>• {trend}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import "./StockNews.css";

// Helper for formatting time
function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString();
}

export default function StockNews() {
  const [activeTab, setActiveTab] = useState("news");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Use your NewsAPI.org API key here
  const API_KEY = "5798e593df0c4f93ba49d57c2f1f4667"; // <-- replace with your actual NewsAPI.org key

  useEffect(() => {
    setLoading(true);
    setErr(null);

    fetch(
      `https://newsapi.org/v2/everything?q=stock%20market&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        // NewsAPI returns { articles: [...] }
        if (Array.isArray(data.articles)) {
          setNews(data.articles);
        } else {
          setNews([]);
          setErr("Unexpected response from news API.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setErr("Failed to fetch news.");
        setNews([]);
        setLoading(false);
      });
  }, []);

  // Example insights (can be replaced with API content)
  const insights = {
    topMovers: [
      { symbol: "AAPL", name: "Apple", change: "+2.31%" },
      { symbol: "TSLA", name: "Tesla", change: "+4.10%" },
      { symbol: "NVDA", name: "Nvidia", change: "-1.24%" }
    ],
    marketSummary: {
      SENSEX: "+0.88%",
      NIFTY: "+0.73%",
      NASDAQ: "-0.11%",
      DOW: "+0.29%"
    },
    trends: [
      "AI stocks outperforming",
      "Banking sector recovery",
      "EV stocks gaining traction"
    ]
  };

  return (
    <div className="stock-news-bg">
      <div className="stock-news-container">
      
        <h1 className="stock-news-title">Stock Market News & Insights</h1>
        <div className="stock-news-tabs">
          <button
            className={activeTab === "news" ? "active" : ""}
            onClick={() => setActiveTab("news")}
          >
            News Headlines
          </button>
          <button
            className={activeTab === "insights" ? "active" : ""}
            onClick={() => setActiveTab("insights")}
          >
            Insights
          </button>
        </div>

        {activeTab === "news" ? (
          loading ? (
            <div className="news-loading">Loading news...</div>
          ) : err ? (
            <div className="news-error">{err}</div>
          ) : (
            <div className="news-list">
              {news.map((n, idx) => (
                <a
                  key={n.url || idx}
                  className="news-card"
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {n.urlToImage && (
                    <div className="news-image-wrapper">
                      <img
                        src={n.urlToImage}
                        alt={n.title}
                        className="news-image"
                      />
                    </div>
                  )}
                  <div className="news-meta">
                    <span className="news-source">{n.source?.name}</span>
                    <span className="news-date">
                      {formatTime(n.publishedAt)}
                    </span>
                  </div>
                  <div className="news-title">{n.title}</div>
                  <div className="news-summary">
                    {n.description?.length > 160
                      ? n.description.slice(0, 160) + "..."
                      : n.description}
                  </div>
                </a>
              ))}
            </div>
          )
        ) : (
          <div className="insights-section">
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
        )}
      </div>
    </div>
  );
}