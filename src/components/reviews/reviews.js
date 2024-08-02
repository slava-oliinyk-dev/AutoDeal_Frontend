import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import axiosInstance from '../../axiosConfig';
import './reviews.css';

const AppReviews = ({ auth }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactDate, setContactDate] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [errors, setErrors] = useState({ contactName: false, contactDate: false, contactMessage: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 5;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews from:', `${axiosInstance.defaults.baseURL}/reviews/get`);
      const response = await axiosInstance.get('/reviews/get'); 
      console.log('Response data:', response.data);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews', error);
      setErrorMessage('Failed to load reviews.');
    }
  };

  const openReviewsModal = () => {
    setIsReviewsModalOpen(true);
    document.body.classList.add('no-scroll');
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setIsThankYouModalOpen(false);
    setErrorMessage('');
    document.body.classList.remove('no-scroll');
  };

  const handleContactNameChange = (e) => {
    setContactName(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactName: false }));
      setErrorMessage('');
    }
  };

  const handleContactDateChange = (e) => {
    setContactDate(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactDate: false }));
      setErrorMessage('');
    }
  };

  const handleContactMessageChange = (e) => {
    setContactMessage(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactMessage: false }));
      setErrorMessage('');
    }
  };

  const openThankYouModal = () => {
    const newErrors = {
      contactName: !contactName,
      contactDate: !contactDate,
      contactMessage: !contactMessage
    };
    setErrors(newErrors);

    if (contactName && contactDate && contactMessage) {
      setContactName('');
      setContactDate('');
      setContactMessage('');
      setIsReviewsModalOpen(false);
      setIsThankYouModalOpen(true);
    } else {
      setErrorMessage('Пожалуйста, заполните все поля.');
    }
  };

  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    document.body.classList.remove('no-scroll');
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reviews.length / reviewsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    if (number >= currentPage - 1 && number <= currentPage + 1) {
      return (
        <p
          key={number}
          className={currentPage === number ? 'active' : ''}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </p>
      );
    }
    return null;
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.bytewaves.net/reviews/delete/${id}`, { 
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setReviews(reviews.filter(review => review.id !== id)); 
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  return (
    <div id="reviews" className="reviews">
      <div className="reviews-content">
        <div className="reviews-content__grid-container">
          <div className="reviews-item">
            <h1>Дмитрий</h1>
            <p>Заказывал перегон автомобиля из Германии, и остался полностью доволен услугами этой компании. Спасибо за профессионализм и качественный сервис! Машина была доставлена в срок, без единой царапины и с полным пакетом документов. Очень доволен работой компании и обязательно буду рекомендовать друзьям и знакомым!</p>
            <img className="reviews-item__user" src="/images/reviewsUserOne.png" alt="" />
            <img className="reviews-item__orange" src="/images/reviewsOrange.png" alt="" />
          </div>
          <div className="reviews-item">
            <h1>Олег</h1>
            <p>Не думал, что перегон автомобиля из Франции может быть таким простым и беспроблемным. Компания взяла все на себя, от оформления документов до транспортировки. Каждый этап был тщательно проработан, и я всегда был в курсе всех новостей. Машина приехала в отличном состоянии и даже раньше срока. Рекомендую всем, кто ищет надежного партнера для доставки автомобилей.</p>
            <img className="reviews-item__user" src="/images/reviewsUserThree.png" alt="" />
            <img className="reviews-item__orange" src="/images/reviewsOrange.png" alt="" />
          </div>
          <div className="reviews-item">
            <h1>Анастасия</h1>
            <p>Когда я решила заказать перегон авто из Италии, не ожидала, что процесс пройдет так гладко. Служба поддержки всегда была на связи, оперативно отвечая на все вопросы. Я была приятно удивлена, когда увидела, что машина пришла не только вовремя, но и в идеальном состоянии. Очень благодарна за качественный сервис и внимание к деталям.</p>
            <img className="reviews-item__user" src="/images/reviewsUserTwo.png" alt="" />
            <img className="reviews-item__orange" src="/images/reviewsOrange.png" alt="" />
          </div>
        </div>
        <div className="reviews-button">
          <button onClick={openReviewsModal}>Больше отзывов</button>
        </div>
      </div>
      {isReviewsModalOpen && (
        <div className="modal-reviews" onClick={closeReviewsModal}>
          <div className="modal-reviews__content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeReviewsModal}>&times;</button>
            <h2>Отзывы наших <span className="heroSection-highlight">клиентов</span></h2>
            {reviews.length === 0 ? (
              <p className='reviews__empty'>Отзывы отсутствуют</p>
            ) : (
              currentReviews.map(review => (
                <div key={review.id} className="modal-reviews__content-reviews">
                  <div className="content-reviews__img-name-date">
                    <div className="content-reviews__img-name">
                      <img src="/images/reviewsOrange.png" alt="" />
                      <h3>{review.name}</h3>
                    </div>
                    <p>{review.date}</p>
                  </div>
                  <p className="review-text">{review.text}</p>
                  {auth.role === 'ADMIN' && (
                    <button className="delete-button" onClick={() => handleDelete(review.id)}>
                      Удалить
                    </button>
                  )}
                </div>
              ))
            )}
            <div className="reviews__pagination">
              {renderPageNumbers}
            </div>
            <div className="reviews__write-reviews">
              <h3>Оставить отзыв</h3>
              <div className={`reviews__write-reviews__name ${errors.contactName ? 'input-error' : ''}`}>
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={contactName}
                  onChange={handleContactNameChange}
                />
              </div>
              <div className={`reviews__write-reviews__date ${errors.contactDate ? 'input-error' : ''}`}>
                <input
                  type="text"
                  placeholder="Введите дату"
                  value={contactDate}
                  onChange={handleContactDateChange}
                />
              </div>
              <div className={`reviews__write-reviews__message ${errors.contactMessage ? 'input-error' : ''}`}>
                <textarea
                  placeholder="Введите ваш отзыв"
                  value={contactMessage}
                  onChange={handleContactMessageChange}
                ></textarea>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button onClick={openThankYouModal}>Добавить</button>
            </div>
          </div>
        </div>
      )}
      {isThankYouModalOpen && (
        <div className="modal-thank-you" onClick={closeThankYouModal}>
          <div className="modal-thank-you__content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeThankYouModal}>&times;</button>
            <h2>Спасибо за ваш отзыв!</h2>
            <p>Ваш отзыв успешно отправлен. Ожидайте, пока наш модератор проверит его и добавит на сайт. Спасибо за ваше терпение!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppReviews;
