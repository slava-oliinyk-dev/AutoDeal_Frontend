import { useEffect, useState } from "react";
import styles from "./CarsCatalogPage.module.scss";
import { useNavigate } from "react-router-dom";

import CarsCatalogFiltersModal from "./CarsCatalogFiltersModal";
import { getCars, sendLead } from "../api/leads.api";
import type { Car } from "../api/leads.api";

import { normalizeEmail, validateEmail } from "../../utils/validation";
import { Modal } from "../Ui/Modal/Modal";

type ContactStep = "form" | "thanks";

const PAGE_SIZE = 9;

const CarsCatalogPage = () => {
  const navigate = useNavigate();

  // filters modal
  const [filtersOpen, setFiltersOpen] = useState(false);

  // contact modal
  const [contactOpen, setContactOpen] = useState(false);
  const [contactStep, setContactStep] = useState<ContactStep>("form");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // catalog data
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const resetContact = () => {
    setContactStep("form");
    setSelectedCar(null);
    setEmail("");
    setFormError(null);
    setIsSubmitting(false);
  };

  const handleContactOpenChange = (nextOpen: boolean) => {
    setContactOpen(nextOpen);
    if (!nextOpen) resetContact();
  };

  const openModalForCar = (car: Car) => {
    setSelectedCar(car);
    setContactStep("form");
    setEmail("");
    setFormError(null);
    setIsSubmitting(false);
    setContactOpen(true);
  };

  const handleSubmitContact = async () => {
    if (isSubmitting) return;

    setFormError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setFormError(emailError);
      return;
    }

    try {
      setIsSubmitting(true);

      await sendLead({
        type: "CAR_CONTACT",
        email: normalizeEmail(email),
      });

      setContactStep("thanks");
      setEmail("");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadFirstPage() {
      try {
        setLoading(true);
        setFetchError(null);

        const data = await getCars({ limit: PAGE_SIZE, offset: 0 });
        if (cancelled) return;

        setCars(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (e) {
        if (!cancelled) setFetchError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFirstPage();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setFetchError(null);

      const chunk = await getCars({ limit: PAGE_SIZE, offset: cars.length });
      setCars((prev) => [...prev, ...chunk]);

      if (chunk.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (fetchError) return <div className={styles.container}>Error: {fetchError}</div>;

  return (
    <section className={styles.catalog}>
      <div className={styles.container}>
        <div className={styles.titleFilter}>
          <h2 className={styles.title}>Catalog</h2>
          <button type="button" className={styles.openBtn} onClick={() => setFiltersOpen(true)}>
            Filter
          </button>
        </div>

        <CarsCatalogFiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />

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
            const badge = car.status ?? "—";

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

                      <button
                        className={styles.btnGhost}
                        type="button"
                        onClick={(e) => {
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

        {hasMore && (
          <div className={styles.loadMoreWrap}>
            <button className={styles.btnMore} type="button" onClick={onLoadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Show more cars"}
            </button>
          </div>
        )}
      </div>

      <Modal open={contactOpen} onOpenChange={handleContactOpenChange}>
        {contactStep === "form" ? (
          <form
            className={styles.modal}
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmitContact();
            }}
          >
            <h2 className={styles.modalTitle}>Contact us</h2>
            <h3 className={styles.modalSubtitle}>
              Leave your email, and our team will contact you shortly to discuss <span className={styles.accent}>{selectedCar?.name ?? "the car"}</span>, confirm availability, and answer any questions.
            </h3>

            <input className={styles.modalInput} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />

            {formError && <p className={styles.error}>{formError}</p>}

            <div className={styles.modalButtonContainer}>
              <button type="button" onClick={() => handleContactOpenChange(false)} className={styles.close} disabled={isSubmitting}>
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
              <button type="button" onClick={() => handleContactOpenChange(false)} className={styles.modalCloseButton}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default CarsCatalogPage;
