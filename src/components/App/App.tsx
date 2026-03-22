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
import PrivacyPolicyPage from "../LegalDocument/PrivacyPolicyPage";
import TermsConditionsPage from "../LegalDocument/TermsConditionsPage";
import { scrollToSection } from "../../utils/navigation";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const targetId = state?.scrollTo ?? location.hash.replace("#", "");

    if (!targetId) return;

    requestAnimationFrame(() => {
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      scrollToSection(targetId);
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
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/auth" element={<AuthLayout />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}
