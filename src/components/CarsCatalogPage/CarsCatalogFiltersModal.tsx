import Modal from "../Ui/Modal/Modal";
import styles from "./CarsCatalogFiltersModal.module.scss";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CarsCatalogFiltersModal = ({ open, onOpenChange }: Props) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Filters" contentClassName={styles.filtersContent} bodyClassName={styles.filtersBody} closeClassName={styles.closeBtn}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Price</h4>
        <div className={styles.row2}>
          <label className={styles.field}>
            <span className={styles.label}>Min</span>
            <input className={styles.input} placeholder="€ 0" inputMode="numeric" />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Max</span>
            <input className={styles.input} placeholder="€ 50,000" inputMode="numeric" />
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Make / Model</h4>
        <div className={styles.row2}>
          <label className={styles.field}>
            <span className={styles.label}>Make</span>
            <select className={styles.select} defaultValue="">
              <option value="" disabled>
                Select make
              </option>
              <option>Audi</option>
              <option>BMW</option>
              <option>Mercedes-Benz</option>
              <option>Volkswagen</option>
              <option>Porsche</option>
              <option>Tesla</option>
              <option>Toyota</option>
              <option>Ford</option>
              <option>Hyundai</option>
              <option>Kia</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Model</span>
            <select className={styles.select} defaultValue="" disabled>
              <option value="" disabled>
                Select model
              </option>
            </select>
            <span className={styles.hint}>Select a make first</span>
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Year</h4>
        <div className={styles.row2}>
          <input className={styles.input} placeholder="From 2005" inputMode="numeric" />
          <input className={styles.input} placeholder="To 2025" inputMode="numeric" />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Mileage</h4>
        <div className={styles.row2}>
          <input className={styles.input} placeholder="From 0 km" inputMode="numeric" />
          <input className={styles.input} placeholder="To 200,000 km" inputMode="numeric" />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Fuel Type</h4>
        <div className={styles.chips}>
          {["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid", "Hydrogen"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Transmission</h4>
        <div className={styles.chips}>
          {["Automatic", "Manual", "CVT", "Dual-Clutch", "Semi-Automatic"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Body Type</h4>
        <div className={styles.chips}>
          {["Sedan", "Hatchback", "Wagon", "SUV", "Coupe", "Convertible", "Minivan", "Pickup"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Drive Type</h4>
        <div className={styles.chips}>
          {["Front-wheel", "Rear-wheel", "All-wheel"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Power (hp)</h4>
        <div className={styles.row2}>
          <input className={styles.input} placeholder="From 90" inputMode="numeric" />
          <input className={styles.input} placeholder="To 500" inputMode="numeric" />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Condition</h4>
        <div className={styles.chips}>
          {["New", "Used", "Damaged"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>

        <h4 className={styles.sectionTitle} style={{ marginTop: 12 }}>
          Seller
        </h4>
        <div className={styles.chips}>
          {["Dealer", "Private Seller"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Location</h4>
        <div className={styles.row2}>
          <input className={styles.input} placeholder="City / ZIP code" />
          <select className={styles.select} defaultValue="50">
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
            <option value="200">200 km</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Features</h4>
        <div className={styles.chips}>
          {["Air Conditioning", "Cruise Control", "Navigation", "Parking Sensors", "Rear Camera", "Heated Seats", "LED / Xenon", "Tow Hitch", "Apple CarPlay", "Android Auto", "Panoramic Roof", "Keyless Entry"].map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.reset}>
          Reset
        </button>
        <button type="button" className={styles.apply} onClick={() => onOpenChange(false)}>
          Apply filters
        </button>
      </div>
    </Modal>
  );
};

export default CarsCatalogFiltersModal;
