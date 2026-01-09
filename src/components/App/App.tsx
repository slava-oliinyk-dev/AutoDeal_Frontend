import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import AuthLayout from "../AuthLayout/AuthLayout";
import AdminPanel from "../AdminPanel/AdminPanel";
import { useEffect } from "react";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const targetId = state?.scrollTo ?? location.hash.replace("#", "");

    if (!targetId) return;

    requestAnimationFrame(() => {
      const section = document.getElementById(targetId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [location]);

  return (
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
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars/:id" element={<Card />} />
          <Route path="/catalog" element={<CarsCatalogPage />} />
          <Route path="/auth" element={<AuthLayout />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}
