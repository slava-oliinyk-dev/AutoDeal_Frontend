import styles from "./Card.module.scss";
import { Modal } from "../Ui/Modal/Modal";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { useNavigate, useParams } from "react-router-dom";
import { normalizeEmail, validateEmail } from "../../utils/validation";
import { sendLead } from "../api/leads.api";
import { deleteCarById, getCarById, type CarDetails } from "../api/cars.api";
import { withBackendUrl } from "../../utils/media";
import { isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";

type Step = "form" | "thanks";

const Card = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFsOpen, setIsFsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authState, setAuthState] = useState(() => ({
    authed: isAuthenticated(),
    admin: isAdmin(),
  }));

  useEffect(() => {
    const unsubscribe = subscribeAuthChange(() =>
      setAuthState({
        authed: isAuthenticated(),
        admin: isAdmin(),
      })
    );

    return unsubscribe;
  }, []);

  const resetModalState = () => {
    setStep("form");
    setEmail("");
    setError(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetModalState();
  };

  const openModalForCar = (car: CarDetails) => {
    setStep("form");
    setEmail("");
    setError(null);
    setIsSubmitting(false);

    setCar(car);
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
        carTitle: car?.name ?? undefined,
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
    if (!isFsOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFsOpen]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCarById(id);
        setCar(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!car) return;
    try {
      await deleteCarById(car.id);
      navigate("/catalog");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const canDelete = authState.authed && authState.admin;

  const photos = useMemo(() => {
    if (!car) return [];
    return [car.photo1, car.photo2, car.photo3, car.photo4, car.photo5].filter((x): x is string => typeof x === "string" && x.length > 0).map(withBackendUrl);
  }, [car]);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!car) return <div className={styles.container}>Not found</div>;

  return (
    <section className={styles.card}>
      <div className={styles.container}>
        <div className={styles.photos}>
          <Swiper
            modules={[Navigation, Pagination, Keyboard, Thumbs]}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            spaceBetween={12}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            onSlideChange={(sw: SwiperType) => setActiveIndex(sw.activeIndex)}
            className={styles.swiper}
          >
            {photos.map((src, idx) => (
              <SwiperSlide key={`${src}-${idx}`} className={styles.slide}>
                <img className={styles.img} src={src} alt="" onClick={() => setIsFsOpen(true)} />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper modules={[Thumbs, FreeMode]} onSwiper={setThumbsSwiper} spaceBetween={8} slidesPerView={4} freeMode watchSlidesProgress slideToClickedSlide className={styles.thumbs}>
            {photos.map((src, idx) => (
              <SwiperSlide key={`${src}-thumb-${idx}`} className={styles.thumbSlide}>
                <img className={styles.thumbImg} src={src} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>

          <Modal open={isFsOpen} onOpenChange={setIsFsOpen} contentClassName={styles.galleryModalContent} bodyClassName={styles.galleryModalBody} closeClassName={styles.galleryClose}>
            <Swiper modules={[Navigation, Pagination, Keyboard]} navigation pagination={{ clickable: true }} keyboard={{ enabled: true }} initialSlide={activeIndex} spaceBetween={12} slidesPerView={1} className={styles.fsSwiper}>
              {photos.map((src, idx) => (
                <SwiperSlide key={`${src}-fs-${idx}`} className={styles.fsSlide}>
                  <img className={styles.fsImg} src={src} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          </Modal>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{car.name ?? "Untitled"}</h1>
              <span className={styles.status}>{car.status ?? "—"}</span>
            </div>

            <p className={styles.desc}>{car.description ?? ""}</p>

            <div className={styles.chips}>
              {car.auction && <span className={styles.chip}>{car.auction}</span>}
              {car.lot && <span className={styles.chip}>{car.lot}</span>}
              <span className={styles.chip}>{[car.country, car.city].filter(Boolean).join(", ") || "—"}</span>
            </div>
          </div>

          <div className={styles.specs}>
            <h2 className={styles.blockTitle}>Specifications</h2>

            <div className={styles.specGrid}>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Year</span>
                <span className={styles.specValue}>{car.year ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Mileage</span>
                <span className={styles.specValue}>{car.mileage ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Fuel</span>
                <span className={styles.specValue}>{car.fuel ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Transmission</span>
                <span className={styles.specValue}>{car.transmission ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Drive</span>
                <span className={styles.specValue}>{car.drive ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Engine</span>
                <span className={styles.specValue}>{car.engine ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Body</span>
                <span className={styles.specValue}>{car.body ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Seats</span>
                <span className={styles.specValue}>{car.seats ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Color</span>
                <span className={styles.specValue}>{car.color ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Owners</span>
                <span className={styles.specValue}>{car.owners ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>State</span>
                <span className={styles.specValue}>{car.state ?? "—"}</span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>VIN</span>
                <span className={styles.specValueMono}>{car.vin ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className={styles.specs}>
            <h2 className={styles.blockTitle}>Equipment</h2>
            <div className={styles.chips}>
              {(car.equipment ?? []).map((item) => (
                <span key={item} className={styles.chip}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.purchase}>
            <div className={styles.priceRow}>
              <div className={styles.priceLabel}>Price</div>
              <div className={styles.price}>€{car.price ?? "—"}</div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModalForCar(car);
                }}
              >
                Get Consultation
              </button>
              {canDelete && (
                <button className={styles.btnDanger} type="button" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>

            <div className={styles.note}>Usually replies within 15–30 minutes during working hours.</div>
          </div>
        </div>
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
              Leave your email, and our team will contact you shortly to discuss <span className={styles.accent}>{car ? car.name : "the car"}</span>, confirm availability, and answer any questions.
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

export default Card;
