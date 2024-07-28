import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./app.css";
import AppNav from "../navBar/navBar";
import AppMain from "../main/main";
import AppBrands from '../brands/brands';
import AppAdvantages from "../advantages/advantages";
import AppCatalog from '../catalog/catalog';
import AppExperts from "../experts/experts";
import AppReviews from '../reviews/reviews';
import AppConsultation from "../consultation/consultation";
import AppSelection from '../selection/selection';
import AppFooter from "../footer/footer";
import Login from '../login/login';

const App = () => {
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), role: localStorage.getItem('role') });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setAuth({ token, role });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/" element={
          <div className="app">
            <AppNav auth={auth} setAuth={setAuth}/>
            <AppMain />
            <AppBrands />
            <AppAdvantages />
            <AppCatalog auth={auth} />
            <AppExperts />
            <AppReviews auth={auth} /> 
            <AppConsultation />
            <AppSelection />
            <AppFooter />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;

