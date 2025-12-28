import styles from "./CarsCatalogPreview.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Car = {
  id: string | number;
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  photo4?: string | null;
  photo5?: string | null;

  name?: string | null;
  description?: string | null;
  year?: string | number | null;
  mileage?: string | number | null;
  fuel?: string | null;
  transmission?: string | null;
  country?: string | null;
  city?: string | null;
  status?: string | null;
  price?: string | number | null;
};

const PAGE_SIZE = 6;

const Catalog = () => {
  const navigate = useNavigate();

  const [visibleCount] = useState(PAGE_SIZE);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

  useEffect(() => {
    async function loadCars() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BACKEND}/cars/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Car[] = await res.json();
        setCars(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [BACKEND]);

  const visibleCars = useMemo(() => cars.slice(0, visibleCount), [cars, visibleCount]);

  if (loading) return <div className={styles.container}>Загрузка...</div>;
  if (error) return <div className={styles.container}>Ошибка: {error}</div>;

  return (
    <section className={styles.catalog}>
      <div className={styles.line}></div>
      <div className={styles.container}>
        <h2 className={styles.title}>Catalog</h2>

        <div className={styles.grid}>
          {visibleCars.map((car) => {
            const image = car.photo1 || car.photo2 || car.photo3 || car.photo4 || car.photo5 || "";

            const title = car.name ?? "Untitled";
            const desc = car.description ?? "";
            const year = car.year ?? "—";
            const mileage = car.mileage ?? "—";
            const fuel = car.fuel ?? "—";
            const transmission = car.transmission ?? "—";
            const location = [car.country, car.city].filter(Boolean).join(" / ") || "—";
            const price = car.price ?? "—";
            const badge = car.status ?? "In Stock";

            return (
              <article key={car.id} className={styles.card} onClick={() => navigate(`/cars/${car.id}`)} role="link" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && navigate(`/cars/${car.id}`)}>
                <div className={styles.imageWrap}>
                  {image ? <img className={styles.image} src={image} alt={title} /> : <div className={styles.image} />}
                  <span className={styles.badge}>{badge}</span>
                </div>

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.desc}>{desc}</p>

                  <div className={styles.meta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Year</span>
                      <span className={styles.metaValue}>{year}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Mileage</span>
                      <span className={styles.metaValue}>{mileage}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Fuel</span>
                      <span className={styles.metaValue}>{fuel}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Transmission</span>
                      <span className={styles.metaValue}>{transmission}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Location</span>
                      <span className={styles.metaValue}>{location}</span>
                    </div>
                  </div>

                  <div className={styles.bottom}>
                    <div className={styles.price}>From €{price}</div>

                    <div className={styles.actions}>
                      <button
                        className={styles.btnPrimary}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Contact Consultant
                      </button>

                      <button
                        className={styles.btnGhost}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cars/${car.id}`);
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button className={styles.moreCars} type="button" onClick={() => navigate("/catalog")}>
          More cars
        </button>
      </div>
    </section>
  );
};

export default Catalog;
