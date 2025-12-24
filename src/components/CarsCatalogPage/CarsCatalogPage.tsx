import { useMemo, useState } from "react";
import styles from "./CarsCatalogPage.module.scss";
import bmw from "../../assets/bmwCatalog.jpg";
import Modal from "../Ui/Modal/Modal";
import CarsCatalogFiltersModal from "./CarsCatalogFiltersModal";

type CarCard = {
  id: string;
  title: string;
  description: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  location: string;
  price: string;
  image: string;
};
const CARS: CarCard[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  title: "BMW 3 Series (G20)",
  description: "Verified listing. Detailed inspection available. Contact a consultant to confirm availability, delivery time, and final price.",
  year: "2021",
  mileage: "42,000 km",
  fuel: "Petrol",
  transmission: "Automatic",
  location: "Germany / EU",
  price: "from €24,900",
  image: bmw,
}));

const PAGE_SIZE = 9;
const CarsCatalogPage = () => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleCars = useMemo(() => CARS.slice(0, visibleCount), [visibleCount]);
  const hasMore = visibleCount < CARS.length;
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.catalog}>
      <div className={styles.container}>
        <div className={styles.titleFilter}>
          <h2 className={styles.title}>Catalog</h2>
          <button type="button" className={styles.openBtn} onClick={() => setOpen(true)}>
            Filter
          </button>
        </div>

        <CarsCatalogFiltersModal open={open} onOpenChange={setOpen} />

        <div className={styles.grid}>
          {visibleCars.map((car) => (
            <article key={car.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img className={styles.image} src={car.image} alt={car.title} />
                <span className={styles.badge}>In Stock</span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{car.title}</h3>
                <p className={styles.desc}>{car.description}</p>

                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Year</span>
                    <span className={styles.metaValue}>{car.year}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Mileage</span>
                    <span className={styles.metaValue}>{car.mileage}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Fuel</span>
                    <span className={styles.metaValue}>{car.fuel}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Transmission</span>
                    <span className={styles.metaValue}>{car.transmission}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Location</span>
                    <span className={styles.metaValue}>{car.location}</span>
                  </div>
                </div>

                <div className={styles.bottom}>
                  <div className={styles.price}>{car.price}</div>

                  <div className={styles.actions}>
                    <button className={styles.btnPrimary} type="button">
                      Contact Consultant
                    </button>
                    <button className={styles.btnGhost} type="button">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className={styles.loadMoreWrap}>
            <button className={styles.btnMore} type="button" onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, CARS.length))}>
              Show more cars
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarsCatalogPage;
