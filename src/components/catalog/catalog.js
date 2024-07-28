import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./catalog.css";
import Slider from '../slider/slider';

const AppCatalog = ({ auth }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contactMethod, setContactMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errors, setErrors] = useState({ contactMethod: false, contactInfo: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isConsultationThankYouModalOpen, setIsConsultationThankYouModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Новое состояние для полноэкранного слайдера
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const response = await axios.get(`http://78.27.236.115:8000/car/get`);
        setCatalogItems(response.data);
      } catch (error) {
        console.error("There was an error fetching the catalog items!", error);
      }
    };

    fetchCatalogItems();

    if (auth && auth.role === 'ADMIN') {
      setIsAdmin(true);
    }
  }, [auth]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = catalogItems.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(catalogItems.length / itemsPerPage); i++) {
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

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setErrorMessage('');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setContactMethod('');
    setContactInfo('');
    setErrors({ contactMethod: false, contactInfo: false });
    setErrorMessage('');
    document.body.classList.remove('no-scroll');
  };

  // Обновленная функция для открытия полноэкранного изображения
  const openFullscreenImage = (index) => {
    if (selectedItem) {
      setFullscreenImages(
        [selectedItem.photo1, selectedItem.photo2, selectedItem.photo3, selectedItem.photo4, selectedItem.photo5]
        .filter(Boolean).map(photo => `http://78.27.236.115:8000/uploads/${photo}`)
      );
      setFullscreenImageIndex(index);
      setIsFullscreen(true);
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const nextFullscreenSlide = () => {
    setFullscreenImageIndex((prevIndex) => (prevIndex + 1) % fullscreenImages.length);
  };

  const prevFullscreenSlide = () => {
    setFullscreenImageIndex((prevIndex) => (prevIndex - 1 + fullscreenImages.length) % fullscreenImages.length);
  };

  // Обработчики касаний для свайпа
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextFullscreenSlide(); // Свайп влево, следующий слайд
    }

    if (touchStartX - touchEndX < -50) {
      prevFullscreenSlide(); // Свайп вправо, предыдущий слайд
    }
  };

  const openConsultationModal = () => {
    setIsConsultationModalOpen(true);
    document.body.classList.add('no-scroll');
  };

  const closeConsultationModal = () => {
    setIsConsultationModalOpen(false);
    setContactMethod('');
    setContactInfo('');
    setErrors({ contactMethod: false, contactInfo: false });
    setErrorMessage('');
    document.body.classList.remove('no-scroll');
  };

  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    document.body.classList.remove('no-scroll');
  };

  const closeConsultationThankYouModal = () => {
    setIsConsultationThankYouModalOpen(false);
    document.body.classList.remove('no-scroll');
  };

  const handleContactMethodChange = (e) => {
    setContactMethod(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactMethod: false }));
    }
  };

  const handleContactInfoChange = (e) => {
    setContactInfo(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactInfo: false }));
    }
  };

  const validateContactInfo = () => {
    if (contactMethod === 'telegram') {
      const telegramRegex = /^@[a-zA-Z0-9_]{4,31}$/;
      if (!telegramRegex.test(contactInfo)) {
        setErrorMessage('Никнейм Telegram должен начинаться с @ и содержать от 5 до 32 символов, включая буквы, цифры и подчеркивания.');
        return false;
      }
    } else if (contactMethod === 'phone') {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(contactInfo)) {
        setErrorMessage('Номер телефона должен содержать только цифры, пробелы, дефисы и круглые скобки, и быть длиной от 7 до 20 символов.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    const newErrors = {
      contactMethod: !contactMethod,
      contactInfo: !contactInfo || !validateContactInfo()
    };
    setErrors(newErrors);

    if (contactMethod && contactInfo && validateContactInfo()) {
      try {
        await axios.post(`http://78.27.236.115:8000/telegram/detailsCar`, {
          contactMethod,
          contactInfo,
          carId: selectedItem.id
        });
        setContactMethod('');
        setContactInfo('');
        setIsModalOpen(false);
        setIsThankYouModalOpen(true);
        setErrorMessage('');
        document.body.classList.remove('no-scroll');
      } catch (error) {
        setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте снова.');
      }
    }
  };

  const handleConsultationSubmit = async () => {
    const newErrors = {
      contactMethod: !contactMethod,
      contactInfo: !contactInfo || !validateContactInfo()
    };
    setErrors(newErrors);

    if (contactMethod && contactInfo && validateContactInfo()) {
      try {
        await axios.post(`http://78.27.236.115:8000/telegram/consultationCar`, {
          contactMethod,
          contactInfo,
          carId: selectedItem.id,
          carName: selectedItem.name
        });
        setContactMethod('');
        setContactInfo('');
        setIsConsultationModalOpen(false);
        setIsConsultationThankYouModalOpen(true);
        setErrorMessage('');
        document.body.classList.remove('no-scroll');
      } catch (error) {
        setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте снова.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://78.27.236.115:8000/car/deleteId/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCatalogItems(catalogItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("There was an error deleting the catalog item!", error);
    }
  };

  return (
    <div id="catalog" className="catalog">
      <div className="catalog-content">
        <h1>Каталог</h1>
        {catalogItems.length === 0 ? (
          <p className='catalog__empty'>Авто отсутствуют</p>
        ) : (
          <>
            <div className="catalog-content__grid-container">
              {currentItems.map(item => (
                <div key={item.id} className="catalog__grid-item">
                  <img src={`/uploads/${item.photo1}`} alt={item.name} onClick={() => openFullscreenImage(0, item)} />
                  <h2>{item.name}</h2>
                  <h3>{item.price}</h3>
                  <div className="catalog__grid-item__icons">
                    <div className="catalog__icons-places">
                      <img src="/images/user.png" alt="" />
                      <p>{item.seats}</p>
                    </div>
                    <div className="catalog__icons-type">
                      <img src="/images/type.png" alt="" />
                      <p>{item.body}</p>
                    </div>
                    <div className="catalog__icons-benzin">
                      <img src="/images/gas-station.png" alt="" />
                      <p>{item.fuel}</p>
                    </div>
                  </div>
                  <div className="catalog__button-img">
                    <button onClick={() => openModal(item)}>Подробнее</button>
                    <img src="/images/strela.png" alt="" />
                  </div>
                  {isAdmin && (
                    <button className="delete-button__admin" onClick={() => handleDelete(item.id)}>Удалить</button>
                  )}
                </div>
              ))}
            </div>
            <div className="catalog__pagination">
              {renderPageNumbers}
            </div>
          </>
        )}
      </div>
      {isModalOpen && selectedItem && (
        <div className={`catalog-modal ${isModalOpen ? 'catalog-modal--open' : ''}`} onClick={closeModal}>
          <div className="catalog-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h2>Введите контактные данные</h2>
            <p>Чтобы узнать подробности об этом автомобиле, пожалуйста, введите ваш номер телефона или ссылку на ваш Telegram. После отправки данных, откроется окно с детальной информацией о машине.</p>

            <div className={`modal-input-group__catalog ${errors.contactMethod ? 'input-error' : ''}`}>
              <select value={contactMethod} onChange={handleContactMethodChange}>
                <option value="" disabled>Способ связи</option>
                <option value="telegram">Telegram</option>
                <option value="phone">Телефон</option>
              </select>
            </div>
            <div className={`modal-input-group__catalog ${errors.contactInfo ? 'input-error' : ''}`}>
              <input
                type="text"
                placeholder="Введите данные для связи"
                value={contactInfo}
                onChange={handleContactInfoChange}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="modal-input-group__two__catalog">
              <button onClick={handleSubmit}>Отправить</button>
            </div>
          </div>
        </div>
      )}
      {isThankYouModalOpen && (
        <div className={`catalog-thankyou-modal ${isThankYouModalOpen ? 'catalog-thankyou-modal--open' : ''}`} onClick={closeThankYouModal}>
          <div className="catalog-thankyou-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeThankYouModal}>&times;</button>
            <h2>{selectedItem.name}</h2>
            {selectedItem && <Slider 
              images={[
                selectedItem.photo1,
                selectedItem.photo2,
                selectedItem.photo3,
                selectedItem.photo4,
                selectedItem.photo5,
              ].filter(Boolean).map(photo => `/uploads/${photo}`)}
              openFullscreenImage={openFullscreenImage} // Передача функции
            />
            }
            <p className='catalog__log-number'>Номер лота: {selectedItem.lot}</p>
            <div className='catalog__characteristics'>
              <h4>Основные характеристики:</h4>
              <p><span className="heroSection-catalog">Цена:</span> {selectedItem.price}</p>
              <p><span className="heroSection-catalog">Пробег:</span> {selectedItem.mileage}</p>
              <p><span className="heroSection-catalog">Год выпуска:</span> {selectedItem.year}</p>
              <p><span className="heroSection-catalog">Цвет:</span> {selectedItem.color}</p>
              <p><span className="heroSection-catalog">Состояние:</span> {selectedItem.state}</p>
              <p><span className="heroSection-catalog">Количество владельцев:</span> {selectedItem.owners}</p>
              <p><span className="heroSection-catalog">Старт аукциона:</span> {selectedItem.auction}</p>
            </div>
            <div className='catalog__characteristics catalog__characteristicsTwo'>
              <h4>Технические характеристики:</h4>
              <p><span className="heroSection-catalog">Тип кузова:</span> {selectedItem.body}</p>
              <p><span className="heroSection-catalog">Двигатель:</span> {selectedItem.engine}</p>
              <p><span className="heroSection-catalog">Привод:</span> {selectedItem.drive}</p>
              <p><span className="heroSection-catalog">Коробка передач:</span> {selectedItem.transmission}</p>
              <p><span className="heroSection-catalog">Тип топлива:</span> {selectedItem.fuel}</p>
            </div>
            <div className='catalog__characteristics catalog__characteristicsThree'>
              <h4>Комплектация:</h4>
              {Array.isArray(selectedItem.equipment) ? (
                selectedItem.equipment.map((equipmentItem, index) => (
                  <p key={index}><span className="heroSection-catalog"></span> {equipmentItem}</p>
                ))
              ) : (
                <p><span className="heroSection-catalog"></span> Нет данных</p>
              )}
            </div>
            <div className="catalog-thankyou-modal__content-button">
              <button onClick={openConsultationModal}>Консультация по авто</button>
            </div>
          </div>
        </div>
      )}
      {isConsultationModalOpen && (
        <div className={`catalog-modal ${isConsultationModalOpen ? 'catalog-modal--open' : ''}`} onClick={closeConsultationModal}>
          <div className="catalog-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeConsultationModal}>&times;</button>
            <h2>Выберите способ связи</h2>
            <p>Чтобы получить консультацию по этому автомобилю, выберите способ связи: через номер телефона или Telegram. Наш менеджер свяжется с вами в ближайшее время для подробной консультации.</p>

            <div className={`modal-input-group__catalog ${errors.contactMethod ? 'input-error' : ''}`}>
              <select value={contactMethod} onChange={handleContactMethodChange}>
                <option value="" disabled>Способ связи</option>
                <option value="telegram">Telegram</option>
                <option value="phone">Телефон</option>
              </select>
            </div>
            <div className={`modal-input-group__catalog ${errors.contactInfo ? 'input-error' : ''}`}>
              <input
                type="text"
                placeholder="Введите данные для связи"
                value={contactInfo}
                onChange={handleContactInfoChange}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="modal-input-group__two__catalog">
              <button onClick={handleConsultationSubmit}>Отправить</button>
            </div>
          </div>
        </div>
      )}
      {isConsultationThankYouModalOpen && (
        <div className={`catalog-modal ${isConsultationThankYouModalOpen ? 'catalog-modal--open' : ''}`} onClick={closeConsultationThankYouModal}>
          <div className="catalog-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeConsultationThankYouModal}>&times;</button>
            <h2>Спасибо за вашу заявку!</h2>
            <p>С вами скоро свяжутся для подробной консультации.</p>
          </div>
        </div>
      )}
      {isFullscreen && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div 
            className="fullscreen-image-container" 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd} 
            onClick={(e) => e.stopPropagation()}>
            <img src={fullscreenImages[fullscreenImageIndex]} alt="Full Screen" className="fullscreen-image" />
            <div className='fullscreen-slider-button__container'>
              <button className="fullscreen-slider-button fullscreen-slider-button-left" onClick={prevFullscreenSlide}>{"<"}</button>
              <button className="fullscreen-slider-button fullscreen-slider-button-right" onClick={nextFullscreenSlide}>{">"}</button>
            </div>
            <button className="close-fullscreen" onClick={closeFullscreen}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppCatalog;
