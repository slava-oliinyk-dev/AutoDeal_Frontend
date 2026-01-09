import styles from "./Review.module.scss";
import { REVIEWS } from "../../data/reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import avatar from "../../assets/avatarReviews/reviewUser.png";
import "swiper/css";
import "swiper/css/navigation";

const Review = () => {
  return (
    <section className={styles.review} id="review">
      <div className={styles.line} />
      <div className={styles.container}>
        <h2 className={styles.title}>Reviews</h2>
        <h3 className={styles.subtitle}>Read real reviews from clients who trusted us with their car purchase. From the first consultation to final delivery, we focus on transparency, clear communication, and a smooth experience.</h3>
        <div className={styles.sliderRow}>
          <button className={styles.prev} type="button" aria-label="Previous" />
          <Swiper
            className={styles.swiper}
            modules={[Navigation]}
            navigation={{
              prevEl: `.${styles.prev}`,
              nextEl: `.${styles.next}`,
            }}
            spaceBetween={24}
            slidesPerView={3}
            breakpoints={{
              0: { slidesPerView: 1 },
              700: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={false}
          >
            {REVIEWS.map((review) => (
              <SwiperSlide key={review.id}>
                <article className={styles.card}>
                  <img className={styles.avatar} src={avatar} alt="" />
                  <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>
                  <div className={styles.meta}>
                    <p className={styles.name}>{review.name}</p>
                    <p className={styles.date}>{review.date}</p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className={styles.next} type="button" aria-label="Next" />
        </div>
      </div>
      <div className={styles.line}></div>
    </section>
  );
};

export default Review;
