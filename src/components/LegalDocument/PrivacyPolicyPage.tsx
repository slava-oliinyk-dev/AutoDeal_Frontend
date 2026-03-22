import LegalDocument from "./LegalDocument";
import { privacyPolicySections } from "./privacyContent";

const PrivacyPolicyPage = () => {
  return <LegalDocument title="Privacy Policy" sections={privacyPolicySections} />;
};

export default PrivacyPolicyPage;
