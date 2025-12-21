import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Navbar from "../Navbar/Navbar";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
      </div>
    </Router>
  );
};

export default App;
