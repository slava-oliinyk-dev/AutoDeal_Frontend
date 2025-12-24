import styles from "./FiltersSidebar.module.scss";

const FiltersSidebar = () => {
  return (
    <section className={styles.bar} aria-label="Catalog filters">
      <div className={styles.topRow}>
        <div className={styles.topLeft}>
          <h3 className={styles.title}>Filters</h3>
          <button className={styles.reset} type="button">
            Reset
          </button>
        </div>

        <button className={styles.apply} type="button">
          Apply filters
        </button>
      </div>

      <div className={styles.filters}>
        {/* Price */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Price</h4>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span className={styles.label}>Min</span>
              <input className={styles.input} inputMode="numeric" placeholder="€ 0" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Max</span>
              <input className={styles.input} inputMode="numeric" placeholder="€ 50 000" />
            </label>
          </div>

          <div className={styles.pills}>
            <button className={styles.pill} type="button">
              up to 10k
            </button>
            <button className={styles.pill} type="button">
              up to 20k
            </button>
            <button className={styles.pill} type="button">
              up to 30k
            </button>
          </div>
        </div>

        {/* Brand & model */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Brand &amp; model</h4>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span className={styles.label}>Brand</span>
              <select className={styles.select} defaultValue="">
                <option value="" disabled>
                  Select brand
                </option>
                <option>BMW</option>
                <option>Audi</option>
                <option>Mercedes-Benz</option>
                <option>Volkswagen</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Model</span>
              <select className={styles.select} defaultValue="" disabled>
                <option value="" disabled>
                  Select model
                </option>
              </select>
              <p className={styles.hint}>Choose brand first</p>
            </label>
          </div>
        </div>

        {/* Year */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Year</h4>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span className={styles.label}>From</span>
              <input className={styles.input} inputMode="numeric" placeholder="2015" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>To</span>
              <input className={styles.input} inputMode="numeric" placeholder="2025" />
            </label>
          </div>
        </div>

        {/* Mileage */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Mileage</h4>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span className={styles.label}>Min</span>
              <input className={styles.input} inputMode="numeric" placeholder="0 km" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Max</span>
              <input className={styles.input} inputMode="numeric" placeholder="200 000 km" />
            </label>
          </div>
        </div>

        {/* Fuel */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Fuel</h4>
          </div>

          <div className={styles.optionsInline}>
            {["Petrol", "Diesel", "Hybrid", "Electric"].map((v) => (
              <label className={styles.chipCheck} key={v}>
                <input className={styles.check} type="checkbox" />
                <span className={styles.chipText}>{v}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Transmission</h4>
          </div>

          <div className={styles.segment}>
            <button className={`${styles.segmentBtn} ${styles.segmentBtnActive}`} type="button">
              Any
            </button>
            <button className={styles.segmentBtn} type="button">
              Automatic
            </button>
            <button className={styles.segmentBtn} type="button">
              Manual
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersSidebar;
