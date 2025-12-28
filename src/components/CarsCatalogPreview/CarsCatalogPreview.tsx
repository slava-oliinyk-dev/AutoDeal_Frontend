import styles from "./CarsCatalogPreview.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars, sendLead } from "../api/leads.api";
import type { Car } from "../api/leads.api";
import { Modal } from "../Ui/Modal/Modal";
import { normalizeEmail, validateEmail } from "../../utils/validation";

type Step = "form" | "thanks";

const Catalog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetModalState = () => {
    setStep("form");
    setEmail("");
    setError(null);
    setIsSubmitting(false);
    setSelectedCar(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetModalState();
  };

  const openModalForCar = (car: Car) => {
    setStep("form");
    setEmail("");
    setError(null);
    setIsSubmitting(false);

    setSelectedCar(car);
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
        type: "CAR_CONTACT",
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

  useEffect(() => {
    let cancelled = false;

    async function loadCars() {
      try {
        setLoading(true);
        setError(null);

        const data = await getCars({ limit: 6, offset: 0 });

        if (!cancelled) setCars(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCars();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <section className={styles.catalog}>
      <div className={styles.line}></div>
      <div className={styles.container}>
        <h2 className={styles.title}>Catalog</h2>

        <div className={styles.grid}>
          {cars.map((car) => {
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
                          openModalForCar(car);
                        }}
                      >
                        Contact Consultant
                      </button>

                      <button className={styles.btnGhost} type="button" onClick={(e) => {}}>
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

      <Modal open={open} onOpenChange={handleOpenChange}>
        {step === "form" ? (
          <form
            className={styles.modal}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2 className={styles.modalTitle}>Contact us</h2>
            <h3 className={styles.modalSubtitle}>
              Leave your email, and our team will contact you shortly to discuss <span className={styles.accent}>{selectedCar ? selectedCar.name : "the car"}</span>, confirm availability, and answer any questions.
            </h3>

            <input className={styles.modalInput} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.modalButtonContainer}>
              <button type="button" onClick={() => handleOpenChange(false)} className={styles.close} disabled={isSubmitting}>
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

export default Catalog;
