import styles from "./Consultation.module.scss";
import consultantFirst from "../../assets/consultants/consultant1.jpg";
import consultantSecond from "../../assets/consultants/consultant2.jpg";

const Consultation = () => {
  return (
    <section className={styles.consultation}>
      <div className={styles.line}></div>
      <div className={styles.container}>
        <h2 className={styles.title}>Expert Consultation</h2>
        <h3 className={styles.subtitle}>
          Our experienced automotive consultants with over 11 years of expertise guide you through every step of buying and delivering vehicles from the USA, China, and Europe. We handle the details, answer all your questions, and help you secure the best option tailored to your needs and budget.
          Get in touch with us today for a personalized consultation and exclusive offers.
        </h3>
        <div className={styles.consultants}>
          <figure className={styles.consultant}>
            <img src={consultantFirst} alt="Photo of the consultant" />
            <figcaption>
              <p className={styles.name}>Michael Carter</p>
              <p className={styles.role}>Vehicle Sourcing Specialist</p>
              <div className={styles.consultantActions}>
                <button className={styles.btnPrimary} type="button">
                  Contact
                </button>
              </div>
            </figcaption>
          </figure>
          <figure className={styles.consultant}>
            <img src={consultantSecond} alt="Photo of the consultant" />
            <figcaption>
              <p className={styles.name}>Emily Johnson</p>
              <p className={styles.role}>Logistics & Delivery Consultant</p>
              <div className={styles.consultantActions}>
                <button className={styles.btnPrimary} type="button">
                  Contact
                </button>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
