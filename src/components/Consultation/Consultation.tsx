import styles from "./Consultation.module.scss";
import { Modal } from "../Ui/Modal/Modal";
import { useState } from "react";
import { normalizeEmail, validateEmail } from "../../utils/validation";
import { sendLead } from "../api/leads.api";
import { useConsultants } from "../Consultants/Consultants";

type Step = "form" | "thanks";

const Consultation = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const { consultants, isLoading: isConsultantsLoading, error: consultantsError } = useConsultants();

  const resetModalState = () => {
    setStep("form");
    setEmail("");
    setError(null);
    setIsSubmitting(false);
    setSelectedConsultant(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetModalState();
  };

  const handleOpen = (consultantName: string) => {
    resetModalState();
    setSelectedConsultant(consultantName);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setIsSubmitting(true);

      await sendLead({
        type: "CONSULTANT_CONTACT",
        email: normalizeEmail(email),
      });

      setStep("thanks");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.consultation} id="consultation">
      <div className={styles.line}></div>
      <div className={styles.container}>
        <h2 className={styles.title}>Expert Consultation</h2>
        <h3 className={styles.subtitle}>
          Our experienced automotive consultants with over 11 years of expertise guide you through every step of buying and delivering vehicles from the USA, China, and Europe. We handle the details, answer all your questions, and help you secure the best option tailored to your needs and budget.
          Get in touch with us today for a personalized consultation and exclusive offers.
        </h3>
        <div className={styles.consultants}>
          {isConsultantsLoading && consultants.length === 0 && <p>Loading consultants...</p>}
          {consultantsError && <p className={styles.error}>{consultantsError}</p>}
          {consultants.map((consultant) => (
            <figure className={styles.consultant} key={consultant.id}>
              <img src={consultant.photo} alt={`Photo of ${consultant.name}`} />
              <figcaption>
                <p className={styles.name}>{consultant.name}</p>
                <p className={styles.role}>{consultant.role}</p>
                <div className={styles.consultantActions}>
                  <button onClick={() => handleOpen(consultant.name)} className={styles.btnPrimary} type="button">
                    Contact
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Modal open={open} onOpenChange={handleOpenChange}>
        {step === "form" ? (
          <form
            className={styles.modal}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2 className={styles.modalTitle}>
              Contact <span className={styles.accent}>{selectedConsultant ?? "us"}</span>{" "}
            </h2>
            <h3 className={styles.modalSubtitle}> Leave your email, and our team will contact you and answer any questions.</h3>

            <input className={styles.modalInput} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.modalButtonContainer}>
              <button type="button" onClick={() => handleOpenChange(false)} className={styles.modalCloseButton} disabled={isSubmitting}>
                Close
              </button>

              <button className={styles.modalSubmitButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Thank you! Your request has been received</h2>
            <h3 className={styles.modalSubtitle}>We’ll contact you shortly to confirm the details and help you with your request.</h3>

            <div className={styles.modalButtonContainer}>
              <button type="button" onClick={() => handleOpenChange(false)} className={styles.modalCloseButton}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Consultation;
