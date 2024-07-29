import React, { useState } from 'react';
import "./selection.css";

const AppSelection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carBrand, setCarBrand] = useState('');
  const [carType, setCarType] = useState('');
  const [budget, setBudget] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errors, setErrors] = useState({ carBrand: false, carType: false, budget: false, contactMethod: false, contactInfo: false });
  const [errorMessage, setErrorMessage] = useState('');

  const sendDataToServer = async (data) => {
    try {
      const response = await fetch('/telegram/accept', {
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

  const openModal = async () => {
    const newErrors = {
      carBrand: !carBrand,
      carType: !carType,
      budget: !budget,
      contactMethod: !contactMethod,
      contactInfo: !contactInfo || !validateContactInfo(),
    };
    setErrors(newErrors);

    if (carBrand && carType && budget && contactMethod && contactInfo && validateContactInfo()) {
      const formData = {
        carBrand,
        carType,
        budget,
        contactMethod,
        contactInfo
      };

      const result = await sendDataToServer(formData);
      if (result) {
        setCarBrand('');
        setCarType('');
        setBudget('');
        setContactMethod('');
        setContactInfo('');
        setIsModalOpen(true);
        document.body.classList.add('no-scroll');
      } else {
        setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove('no-scroll');
    setErrorMessage('');
  };

  const handleCarBrandChange = (e) => {
    setCarBrand(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, carBrand: false }));
    }
  };

  const handleCarTypeChange = (e) => {
    setCarType(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, carType: false }));
    }
  };

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, budget: false }));
    }
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

  return (
    <div id="selection" className="selection">
      <div className="selection-content">
        <div className="selection-content__text">
          <h2>Подбор автомобиля</h2>
          <p><span className="heroSection-highlight">“</span>Заполните форму, и наш эксперт свяжется с вами, чтобы помочь выбрать идеальный автомобиль, соответствующий вашим предпочтениям и бюджету. Мы обеспечим персонализированный подход и предоставим рекомендации по лучшим вариантам автомобилей.<span className="heroSection-highlight">“</span></p>
        </div>
        <div className="selection-content__selections">
          <h2>Какой автомобиль<br />вам нравится?</h2>
          <div className="selection-content__input">
            <div className={`input-wrapper ${errors.carBrand ? 'input-error' : ''}`}>
              <select value={carBrand} onChange={handleCarBrandChange}>
                <option value="" disabled>Марка авто</option>
                <option value="audi">Audi</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="ford">Ford</option>
                <option value="chevrolet">Chevrolet</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="nissan">Nissan</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">Kia</option>
                <option value="subaru">Subaru</option>
                <option value="mazda">Mazda</option>
                <option value="lexus">Lexus</option>
                <option value="jaguar">Jaguar</option>
                <option value="landrover">Land Rover</option>
                <option value="porsche">Porsche</option>
                <option value="tesla">Tesla</option>
                <option value="lada">Lada</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div className={`input-wrapper ${errors.carType ? 'input-error' : ''}`}>
              <select value={carType} onChange={handleCarTypeChange}>
                <option value="" disabled>Тип кузова</option>
                <option value="sedan">Седан</option>
                <option value="suv">Внедорожник</option>
                <option value="hatchback">Хэтчбек</option>
                <option value="coupe">Купе</option>
                <option value="convertible">Кабриолет</option>
                <option value="wagon">Универсал</option>
                <option value="pickup">Пикап</option>
                <option value="minivan">Минивэн</option>
                <option value="van">Фургон</option>
                <option value="truck">Грузовик</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div className={`input-wrapper ${errors.budget ? 'input-error' : ''}`}>
              <select value={budget} onChange={handleBudgetChange}>
                <option value="" disabled>Бюджет под ключ</option>
                <option value="budget1">до 1,000,000 руб.</option>
                <option value="budget2">1,000,000 - 2,000,000 руб.</option>
                <option value="budget3">более 2,000,000 руб.</option>
              </select>
            </div>
            <div className={`input-wrapper ${errors.contactMethod ? 'input-error' : ''}`}>
              <select value={contactMethod} onChange={handleContactMethodChange}>
                <option value="" disabled>Способ связи</option>
                <option value="telegram">Telegram</option>
                <option value="phone">Телефон</option>
              </select>
            </div>
            <div className={`input-wrapper ${errors.contactInfo ? 'input-error' : ''}`}>
              <input 
                placeholder="Введите данные для связи" 
                type="text" 
                value={contactInfo} 
                onChange={handleContactInfoChange} 
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <div className="selection-button">
            <button onClick={openModal}>Получить консультацию</button>
          </div>
        </div>
        <img className="selection-plus" src="/images/autoPlus.png" alt="" />
      </div>
      <div className={`modal ${isModalOpen ? 'modal--open' : ''}`} onClick={closeModal}>
        <div className="main__modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h2>Спасибо за вашу заявку!</h2>
          <p>Мы получили вашу заявку на подбор автомобиля. Наш эксперт свяжется с вами в ближайшее время, чтобы обсудить ваши предпочтения и предложить лучшие варианты. Спасибо, что выбрали нас!</p>
        </div>
      </div>
    </div>
  );
}

export default AppSelection;
