import React, { useState } from 'react';
import "./main.css";

const AppMain = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errors, setErrors] = useState({ contactMethod: false, contactInfo: false });
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsThankYouModalOpen(false);
    setContactMethod('');
    setContactInfo('');
    setErrors({ contactMethod: false, contactInfo: false });
    setErrorMessage('');
  };

  const handleContactMethodChange = (e) => {
    setContactMethod(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactMethod: false }));
      setErrorMessage('');
    }
  };

  const handleContactInfoChange = (e) => {
    setContactInfo(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, contactInfo: false }));
      setErrorMessage('');
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

  const sendDataToServer = async (data) => {
    try {
      const response = await fetch('/telegram/main', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to send data to server:', error);
      return null;
    }
  };

  const openThankYouModal = async () => {
    const newErrors = {
      contactMethod: !contactMethod,
      contactInfo: !contactInfo || !validateContactInfo()
    };
    setErrors(newErrors);

    if (contactMethod && contactInfo && validateContactInfo()) {
      const formData = {
        contactMethod,
        contactInfo
      };

      const result = await sendDataToServer(formData);

      if (result) {
        setContactMethod('');
        setContactInfo('');
        setIsModalOpen(false);
        setIsThankYouModalOpen(true);
      } else {
        setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  return (
    <div id="home" className="main">
      <div className="main-content">
        <div className="heroSection">
          <h1>Ваш <span className="heroSection-highlight">надежный партнер</span> по<br /> доставке автомобилей из<br /> Европы, США и Китая</h1>
          <p>Получите скидку 5% на первый заказ!</p>
          <div>
            <button onClick={openModal}><span>Оставить заявку</span></button>
            <img  className="heroSection-img" src="/images/кнопка.png" alt="" />
          </div>
          <div className="heroSection-promo">
            <div className="heroSection-promo-year">
              <h1>11</h1>
              <p>Количество лет<br />успешной работы</p>
            </div>
            <div className="heroSection-promo-car">
              <h1>250+</h1>
              <p>Пригнанных авто<br />ежегодно</p>
            </div>
          </div>
        </div>
        <div className="car">
          <img className='main__fon' src="/images/fon.png" alt="fon" />
          <img src="/images/newAuto.png" className="main-content__car-img" alt="Car" />
        </div>
      </div>
      <div className={`modal ${isModalOpen ? 'modal--open' : ''}`} onClick={closeModal}>
        <div className="main__modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h2>Получите скидку <span className="heroSection-highlight">5%</span> на первый заказ</h2>
          <p>Чтобы воспользоваться скидкой 5%, пожалуйста, введите<br />ваши контактные данные. Мы свяжемся с вами для подтверждения<br />и предоставления подробной информации</p>
          <div className={`modal-input-group ${errors.contactMethod ? 'input-error' : ''}`}>
            <select value={contactMethod} onChange={handleContactMethodChange}>
              <option value="" disabled>Способ связи</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Телефон</option>
            </select>
          </div>
          <div className={`modal-input-group ${errors.contactInfo ? 'input-error' : ''}`}>
            <input
              type="text"
              placeholder="Введите данные для связи"
              value={contactInfo}
              onChange={handleContactInfoChange}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="modal-input-group__two">
            <button onClick={openThankYouModal}>Оставить заявку</button>
          </div>
        </div>
      </div>
      <div className={`modal ${isThankYouModalOpen ? 'modal--open' : ''}`} onClick={closeModal}>
        <div className="main__modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h2>Спасибо!</h2>
          <p>Ваши данные успешно отправлены. Мы свяжемся с вами в ближайшее время, чтобы подтвердить получение скидки 5% на ваш первый заказ автомобиля из-за границы.</p>
        </div>
      </div>
    </div>
  );
};

export default AppMain;
