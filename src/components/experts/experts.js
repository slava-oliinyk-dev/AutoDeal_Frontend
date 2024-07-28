import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './experts.css';

const AppExperts = () => {
  const [leftConsultant, setLeftConsultant] = useState(null);
  const [rightConsultant, setRightConsultant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errors, setErrors] = useState({ contactMethod: false, contactInfo: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [specialistMethod, setSpecialistMethod] = useState('');

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const leftResponse = await axios.get(`http://78.27.236.115:8000/consultants/getLeft`);
        const rightResponse = await axios.get(`http://78.27.236.115:8000/consultants/getRight`);
        setLeftConsultant(leftResponse.data[0]);
        setRightConsultant(rightResponse.data[0]);
      } catch (error) {
        console.error('Error fetching consultants', error);
      }
    };
    fetchConsultants();
  }, []);

  const openModal = (consultant) => {
    setIsModalOpen(true);
    setSpecialistMethod(`${consultant.name}, ${consultant.title}`);
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
      const response = await axios.post(`http://78.27.236.115:8000/telegram/experts`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.status === 200) {
        throw new Error('Network response was not ok');
      }

      const result = response.data;
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
        contactInfo,
        specialistMethod
      };

      const result = await sendDataToServer(formData);

      if (result) {
        setContactMethod('');
        setContactInfo('');
        setSpecialistMethod('');
        setIsModalOpen(false);
        setIsThankYouModalOpen(true);
      } else {
        setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  return (
    <div id="contacts" className="experts">
      <div className="experts-content">
        <h1>Консультация от <span className="heroSection-highlight">экспертов</span></h1>
        <p>“Наши профессиональные консультанты с более чем 11-летним опытом помогут вам на всех этапах покупки<br/>и доставки автомобилей из США, Китая и Европы. Мы ответим на все ваши вопросы и подберем лучший<br/>вариант, учитывая ваши предпочтения и бюджет. Свяжитесь с нами для получения индивидуальной<br/>консультации и выгодных предложений.”</p>
        <div className="experts-content__experts">
          {leftConsultant && (
            <div className="experts-content__experts-card experts-card__one">
              <img src={`http://78.27.236.115:8000/uploads/${leftConsultant.photo}`} alt={leftConsultant.name} />
              <h3>{leftConsultant.name}</h3>
              <p>{leftConsultant.title}</p>
              <button onClick={() => openModal(leftConsultant)}>Связаться со мной</button>
            </div>
          )}
          {rightConsultant && (
            <div className="experts-content__experts-card experts-card__two">
              <img src={`http://78.27.236.115:8000/uploads/${rightConsultant.photo}`} alt={rightConsultant.name} />
              <h3>{rightConsultant.name}</h3>
              <p>{rightConsultant.title}</p>
              <button onClick={() => openModal(rightConsultant)}>Связаться со мной</button>
            </div>
          )}
        </div>
      </div>

      <div className="expertsPlus"><img src="/images/expertsPlus.png" alt="" /></div>
      <img className="experts__lightOrange" src="/images/orangeLightTwo.png" alt="" />
      <div className="experts-orangLine"></div>
      <div className={`modal ${isModalOpen ? 'modal--open' : ''}`} onClick={closeModal}>
        <div className="main__modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h2>Свяжитесь с нашими <span className="heroSection-highlight">экспертами</span></h2>
          <p>Оставьте ваш номер телефона или Telegram, и мы с радостью поможем вам!</p>
          <div className={`modal-input-group ${errors.contactMethod ? 'input-error' : ''}`}>
            <select value={contactMethod} onChange={handleContactMethodChange}>
              <option value="" disabled>Способ связи</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Телефон</option>
            </select>
          </div>
          <div className={`modal-input-group ${errors.contactInfo ? 'input-error' : ''}`}>
            <input type="text" placeholder="Введите данные для связи" value={contactInfo}
              onChange={handleContactInfoChange} />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="modal-input-group">
            <button onClick={openThankYouModal}>Отправить</button>
          </div>
        </div>
      </div>
      <div className={`modal ${isThankYouModalOpen ? 'modal--open' : ''}`} onClick={closeModal}>
        <div className="main__modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h2>Спасибо!</h2>
          <p>Ваши данные успешно отправлены. Мы свяжемся с вами в ближайшее время для консультации с нашим экспертом.</p>
        </div>
      </div>
    </div>
  );
};

export default AppExperts;
