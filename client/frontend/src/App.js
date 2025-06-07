// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
// import Register from './component/Register';
// import Dashboard from './component/Dashboard/Dashboard';  // Make sure you have this component created
// import './App.css';
// import LoginPage from './component/Login/login';
// import BudgetSection from './component/Budget/BudgetSection';
// import ProfilePage from './component/ProfileUpdate/ProfilePage';
// import SecurityAndDataSettings from './component/MFA/SecurityAndDataSettings';
// import RegisterPage from './component/Register';
// import GoalDashboard from "./component/Goal/GoalProgressBar";

// function App() {
//   // Global dark mode state
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("theme");
//     return saved === "dark";
//   });
  

//   const toggleDarkMode = () => {
    
//     setDarkMode((prev) => {
//       const newMode = !prev;
//       localStorage.setItem("theme", newMode ? "dark" : "light");
//       return newMode;
//     });
//   };

//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//   }, [darkMode]);
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           {/* Home route */}
//           <Route path="/" element={<Register />} /> 

//           {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//           <Route
//           path="/dashboard"
//           element={
//             <Dashboard
//               darkMode={darkMode}
//               toggleDarkMode={toggleDarkMode}
//             />
//           }
//         />
//           <Route path="/login" element={<LoginPage/>} />
//            <Route path="/budget" element={<BudgetSection darkMode={darkMode}/>} />
//              <Route path="/profile" element={<ProfilePage/>} />
//             <Route path="/mfa" element={<SecurityAndDataSettings />} />
//              <Route path="/register" element={<RegisterPage />} />
//             <Route path="/goal" element={<GoalDashboard/>} />




           
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './component/Register';
import Dashboard from './component/Dashboard/Dashboard';
import './App.css';
import LoginPage from './component/Login/login';
import BudgetSection from './component/Budget/BudgetSection';
import ProfilePage from './component/ProfileUpdate/ProfilePage';
import SecurityAndDataSettings from './component/MFA/SecurityAndDataSettings';
import RegisterPage from './component/Register';
import GoalDashboard from "./component/Goal/GoalProgressBar";
import StockNews from "./component/StocksNews/StockNews";
import StockChart from "./component/StockChart/StockChartPage" 


// This inner component lets us use useLocation (must be inside Router)
function AppRoutes({ darkMode, toggleDarkMode }) {
  const location = useLocation();

  useEffect(() => {
    // Remove dark mode for /register route
    if (location.pathname === "/register" || location.pathname ==="/" || location.pathname ==="/login") {
      document.body.classList.remove("dark-mode");
    } else if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode, location.pathname]);

  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <Dashboard
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/budget" element={<BudgetSection darkMode={darkMode} />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/mfa" element={<SecurityAndDataSettings />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/goal" element={<GoalDashboard />} />
      <Route path="/stock" element={<StockNews/>} />
      <Route path="/stockChart" element={<StockChart/>


      }/>


    </Routes>
  );
}

function App() {
  // Global dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <div className="App">
      <Router>
        <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </Router>
    </div>
  );
}

export default App;