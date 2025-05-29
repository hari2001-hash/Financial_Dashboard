import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './component/Register';
import Dashboard from './component/Dashboard/Dashboard';  // Make sure you have this component created
import './App.css';
import LoginPage from './component/Login/login';
import BudgetSection from './component/Budget/BudgetSection';
import ProfilePage from './component/ProfileUpdate/ProfilePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Register />} /> 

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage/>} />
           <Route path="/budget" element={<BudgetSection/>} />
             <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;