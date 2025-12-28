import styles from "./Hero.module.scss";
import stripe from "../../assets/orange-stripe.png";
import Modal from "../Ui/Modal/Modal";
import { useState } from "react";
import { normalizeEmail, validateEmail } from "../../utils/validation";
import { sendLead } from "../api/leads.api";

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    if (isSubmitting) return;
    e.preventDefault();
    setError(null);

    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);

    try {
      setIsSubmitting(true);

      await sendLead({
        type: "DISCOUNT_5",
        email: normalizeEmail(email),
      });

      setOpen(false);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Your <span className={styles.accent}>trusted partner </span>for
          <br />
          vehicle delivery from
          <br />
          Europe, the USA, and China
        </h1>
        <h2 className={styles.subtitle}>Get 5% off your first order!</h2>
        <div className={styles.button_container}>
          <button onClick={() => setOpen(true)}>Request a quote</button>
          <img src={stripe} alt="orange stripe for style" />
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.value}>11</span>
            <span className={styles.label}>
              Years of proven
              <br />
              experience
            </span>
          </div>

          <div className={styles.stat}>
            <span className={styles.value}>700+</span>
            <span className={styles.label}>
              Vehicles imported <br />
              annually
            </span>
          </div>
        </div>
      </div>
      <Modal open={open} onOpenChange={setOpen}>
        <form className={styles.modal} onSubmit={handleSubmit}>
          <h2 className={styles.modalTitle}>Get 5% off your first order</h2>
          <h3 className={styles.modalSubtitle}>To claim your 5% discount, please enter your email. We’ll reach out to confirm your request and share the details.</h3>
          <input className={styles.modalInput} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.modalButtonContainer}>
            <button onClick={() => setOpen(false)} className={styles.modalCloseButton} disabled={isSubmitting}>
              Close
            </button>
            <button className={styles.modalSubmitButton} disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default Hero;
