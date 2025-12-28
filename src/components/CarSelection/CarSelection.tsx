import { useState } from "react";
import Modal from "../Ui/Modal/Modal";
import styles from "./CarSelection.module.scss";

const CarSelection = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className={styles.selection}>
      <div className={styles.line}></div>
      <div className={styles.container}>
        <div className={styles.info}>
          <h2 className={styles.selectionTitle}>Car Selection</h2>
          <h3 className={styles.subtitle}>
            {" "}
            <span className={styles.accent}>“</span>Fill out the form, and our expert will contact you to help choose the ideal car based on your preferences and budget. We provide a personalized approach and offer the best car options tailored specifically for you.{" "}
            <span className={styles.accent}>”</span>
          </h3>
        </div>
        <div className={styles.survey}>
          <h3 className={styles.title}>Which car are you looking for?</h3>
          <label className={styles.srOnly} htmlFor="carMake">
            Car make
          </label>
          <select id="carMake" className={styles.select} defaultValue="">
            <option value="" disabled>
              Select car make
            </option>
            <option value="audi">Audi</option>
            <option value="bmw">BMW</option>
            <option value="mercedes-benz">Mercedes-Benz</option>
            <option value="volkswagen">Volkswagen</option>
            <option value="porsche">Porsche</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="nissan">Nissan</option>
            <option value="ford">Ford</option>
            <option value="tesla">Tesla</option>
            <option value="volvo">Volvo</option>
            <option value="skoda">Škoda</option>
            <option value="hyundai">Hyundai</option>
            <option value="kia">Kia</option>
            <option value="other">Other / Not sure</option>
          </select>

          <label className={styles.srOnly} htmlFor="bodyType">
            Body type
          </label>
          <select id="bodyType" className={styles.select} defaultValue="">
            <option value="" disabled>
              Select body type
            </option>
            <option value="sedan">Sedan</option>
            <option value="hatchback">Hatchback</option>
            <option value="wagon">Wagon (Estate)</option>
            <option value="suv">SUV</option>
            <option value="crossover">Crossover</option>
            <option value="coupe">Coupe</option>
            <option value="convertible">Convertible</option>
            <option value="minivan">Minivan / MPV</option>
            <option value="pickup">Pickup</option>
            <option value="van">Van</option>
            <option value="other">Other / Not sure</option>
          </select>

          <label className={styles.srOnly} htmlFor="budget">
            Turnkey budget
          </label>
          <select id="budget" className={styles.select} defaultValue="">
            <option value="" disabled>
              Select turnkey budget
            </option>
            <option value="under-10k">Under €10,000</option>
            <option value="10-15k">€10,000–€15,000</option>
            <option value="15-20k">€15,000–€20,000</option>
            <option value="20-30k">€20,000–€30,000</option>
            <option value="30-40k">€30,000–€40,000</option>
            <option value="40-50k">€40,000–€50,000</option>
            <option value="50-70k">€50,000–€70,000</option>
            <option value="70k-plus">€70,000+</option>
            <option value="not-sure">Not sure</option>
          </select>

          <label className={styles.srOnly} htmlFor="contactMethod">
            Preferred contact method
          </label>
          <select id="contactMethod" className={styles.select} defaultValue="">
            <option value="" disabled>
              Preferred contact method
            </option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
          </select>

          <label className={styles.srOnly} htmlFor="contactDetails">
            Contact details
          </label>
          <input id="contactDetails" className={styles.input} type="text" placeholder="Enter your contact details" autoComplete="contact" />
          <button onClick={() => setOpen(true)} className={styles.button}>
            Get a free consultation
          </button>
        </div>
      </div>
      <Modal open={open} onOpenChange={setOpen}>
        <div className={styles.modal}>
          <h2 className={styles.modalTitle}>Your consultation is on the way</h2>
          <h3 className={styles.modalSubtitle}>One of our specialists will contact you shortly using the contact method you selected. Thank you for choosing us.</h3>
          <button onClick={() => setOpen(false)} className={styles.closeButton}>
            Close
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default CarSelection;
