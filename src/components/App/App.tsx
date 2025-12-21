import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Hero />
      </div>
    </Router>
  );
};

export default App;
