import LegalDocument from "./LegalDocument";
import { termsConditionsSections } from "./termsContent";

const TermsConditionsPage = () => {
  return <LegalDocument title="Terms & Conditions" sections={termsConditionsSections} />;
};

export default TermsConditionsPage;
