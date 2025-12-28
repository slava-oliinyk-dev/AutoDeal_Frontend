import { Modal } from "../Ui/Modal/Modal";
import styles from "./Question.module.scss";
import { useState } from "react";
import { validateEmail, validateName } from "../../utils/validation";
import { sendLead } from "../api/leads.api";
import type { LeadType } from "../api/leads.api";

type LeadFormState = {
  type: LeadType;
  name: string;
  email: string;
  consultant: string;
  time: string;
};

const INITIAL_FORM: LeadFormState = {
  type: "CAR_SEARCH",
  name: "",
  email: "",
  consultant: "",
  time: "",
};

const Question = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LeadFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof LeadFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSend = async () => {
    if (isSubmitting) return;
    setError(null);

    const nameError = validateName(form.name);
    if (nameError) return setError(nameError);

    const emailError = validateEmail(form.email);
    if (emailError) return setError(emailError);

    if (!form.consultant) return setError("Select a consultant");
    if (!form.time) return setError("Select time");

    try {
      setIsSubmitting(true);

      await sendLead({
        type: "FREE_CONSULTATION",
        name: form.name.trim(),
        email: form.email.trim(),
        consultant: form.consultant,
        time: form.time,
      });

      setOpen(true);
      setForm(INITIAL_FORM);
      setError(null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.question}>
      <div className={styles.container}>
        <h2 className={styles.title}>Have questions? Get a free consultation</h2>
        <h3 className={styles.subtitle}>Our manager will call you back and answer all your questions.</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className={styles.inputs}>
            <input className={styles.input} type="text" placeholder="Your name" value={form.name} onChange={onChange("name")} />

            <input className={styles.input} type="email" placeholder="Enter your email" value={form.email} onChange={onChange("email")} />

            <label className={styles.srOnly} htmlFor="consultant">
              Choose a consultant
            </label>
            <select id="consultant" className={styles.select} value={form.consultant} onChange={onChange("consultant")}>
              <option value="" disabled>
                Choose a consultant
              </option>
              <option value="anna">Anna</option>
              <option value="mark">Mark</option>
              <option value="kate">Kate</option>
            </select>

            <label className={styles.srOnly} htmlFor="time">
              Choose a convenient time
            </label>
            <select id="time" className={styles.select} value={form.time} onChange={onChange("time")}>
              <option value="" disabled>
                Choose a convenient time
              </option>
              <option value="09-11">09:00–11:00</option>
              <option value="11-13">11:00–13:00</option>
              <option value="14-16">14:00–16:00</option>
              <option value="16-18">16:00–18:00</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button disabled={isSubmitting} className={styles.button} type="submit">
            {isSubmitting ? "Sending..." : "Get a free consultation"}
          </button>
        </form>
      </div>
      <Modal open={open} onOpenChange={setOpen}>
        <div className={styles.modal}>
          <h2 className={styles.modalTitle}>Thank you for your request!</h2>
          <h3 className={styles.modalSubtitle}>We’ll be in touch shortly through your selected contact method.</h3>

          <button type="button" onClick={() => setOpen(false)} className={styles.close}>
            Close
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Question;
