import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Your <span className={styles.accent}>trusted partner </span>for vehicle delivery from Europe, the USA, and China
        </h1>
        <h2 className={styles.subtitle}>Get 5% off your first order!</h2>
        <div className={styles.button_container}>
          <button>Request a quote</button>
          <img src="" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
