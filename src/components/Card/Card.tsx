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
import { useParams } from "react-router-dom";

export type Car = {
  id: number;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  photo5: string;
  name: string;
  price: string;
  seats: string;
  body: string;
  fuel: string;
  lot: string;
  mileage: string;
  auction: string;
  year: string;
  color: string;
  engine: string;
  drive: string;
  transmission: string;
  state: string;
  owners: string;
  equipment: string[];
  vin: string;
  description: string;
  status: string;
  country: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const Card = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFsOpen, setIsFsOpen] = useState(false);
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFsOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFsOpen]);

  const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

  useEffect(() => {
    if (!id) return;

    async function loadCar() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BACKEND}/cars/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Car = await res.json();
        setCar(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadCar();
  }, [BACKEND, id]);

  const photos = useMemo(() => {
    if (!car) return [];
    return [car.photo1, car.photo2, car.photo3, car.photo4, car.photo5].filter((x): x is string => typeof x === "string" && x.length > 0);
  }, [car]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!car) return <div>Не найдено</div>;

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
              <div className={styles.price}>{car.price ?? "—"}</div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="button">
                Get consultation
              </button>
              <button className={styles.btnGhost} type="button">
                Request inspection report
              </button>
            </div>

            <div className={styles.note}>Usually replies within 15–30 minutes during working hours.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;
