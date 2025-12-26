import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Hero from "../Hero/Hero";
import AutomotiveBrand from "../AutomotiveBrand/AutomotiveBrand";
import Advantage from "../Advantage/Advantage";
import CarsCatalogPreview from "../CarsCatalogPreview/CarsCatalogPreview";
import Consultation from "../Consultation/Consultation";
import Review from "../Review/Review";
import Question from "../Question/Question";
import CarSelection from "../CarSelection/CarSelection";
import Card from "../Card/Card";
import Layout from "../Layout/Layout";
import CarsCatalogPage from "../CarsCatalogPage/CarsCatalogPage";
import Test from "../Test/Test";

const Home = () => (
  <>
    <Hero />
    <AutomotiveBrand />
    <Advantage />
    <CarsCatalogPreview />
    <Consultation />
    <Review />
    <Question />
    <CarSelection />
  </>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars/:id" element={<Card />} />
          <Route path="/catalog" element={<CarsCatalogPage />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </Router>
  );
}
