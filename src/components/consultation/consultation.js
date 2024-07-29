import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig'
import './consultation.css';

const AppConsultation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameMethod, setNameMethod] = useState('');
  const [numberMethod, setNumberMethod] = useState('');
  const [specialistMethod, setSpecialistMethod] = useState('');
  const [timeMethod, setTimeMethod] = useState('');
  const [errors, setErrors] = useState({ nameMethod: false, numberMethod: false, specialistMethod: false, timeMethod: false });
  const [consultants, setConsultants] = useState({ left: [], right: [] });

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const leftResponse = await axiosInstance.get('/consultants/getLeft');
        const rightResponse = await axiosInstance.get('/consultants/getRight');
        setConsultants({ left: leftResponse.data, right: rightResponse.data });
      } catch (error) {
        console.error('Error fetching consultants', error);
      }
    };

    fetchConsultants();
  }, []);

  const openModal = async () => {
    const newErrors = {
      nameMethod: !nameMethod,
      numberMethod: !numberMethod,
      specialistMethod: !specialistMethod,
      timeMethod: !timeMethod,
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      try {
        await sendConsultationData();
        setNameMethod('');
        setNumberMethod('');
        setSpecialistMethod('');
        setTimeMethod('');
        setIsModalOpen(true);
        document.body.classList.add('no-scroll');
      } catch (error) {
        console.error('Error sending consultation data', error);
      }
    }
  };

  const sendConsultationData = async () => {
    const data = {
      nameMethod,
      numberMethod,
      specialistMethod,
      timeMethod
    };

    try {
      await axiosInstance.post('/telegram/consultation', data);
    } catch (error) {
      console.error('Error sending consultation data', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove('no-scroll');
  };

  const handleNameChange = (e) => {
    setNameMethod(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, nameMethod: false }));
    }
  };

  const handleNumberChange = (e) => {
    setNumberMethod(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, numberMethod: false }));
    }
  };

  const handleSpecialistChange = (e) => {
    setSpecialistMethod(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, specialistMethod: false }));
    }
  };

  const handleTimeChange = (e) => {
    setTimeMethod(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, timeMethod: false }));
    }
  };

  const availableTimes = [
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '11:30 - 12:00',
    '12:00 - 12:30',
    '12:30 - 13:00',
    '13:00 - 13:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '14:30 - 15:00',
    '15:00 - 15:30',
    '15:30 - 16:00',
    '16:00 - 16:30',
    '16:30 - 17:00',
    '17:00 - 17:30',
    '17:30 - 18:00',
  ];

  return (
    <div id="consultation" className="consultation">
      <div className="consultation-content">
        <h2>Есть вопросы? Получи бесплатную консультацию</h2>
        <p>Наш менеджер перезвонит вам и ответит на все Ваши вопросы. </p>
        <div className="consultation-inputs">
          <div className="consultation__group-input">
            <div className={`input-wrapper ${errors.nameMethod ? 'input-error' : ''}`}>
              <input
                placeholder="Ваше имя"
                type="text"
                value={nameMethod}
                onChange={handleNameChange}
              />
            </div>
            <div className={`input-wrapper ${errors.numberMethod ? 'input-error' : ''}`}>
              <input
                placeholder="Ваш телефон или telegram"
                type="text"
                value={numberMethod}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          <div className="consultation__group-input">
            <div className={`input-wrapper ${errors.specialistMethod ? 'input-error' : ''}`}>
              <select
                value={specialistMethod}
                onChange={handleSpecialistChange}
              >
                <option value="" disabled>Выберите специалиста</option>
                {consultants.left.map((consultant) => (
                  <option key={consultant.id} value={consultant.name}>{consultant.name}. {consultant.title}</option>
                ))}
                {consultants.right.map((consultant) => (
                  <option key={consultant.id} value={consultant.name}>{consultant.name}. {consultant.title}</option>
                ))}
              </select>
            </div>
            <div className={`input-wrapper ${errors.timeMethod ? 'input-error' : ''}`}>
              <select
                value={timeMethod}
                onChange={handleTimeChange}
              >
                <option value="" disabled hidden>Выберите удобное время</option>
                {availableTimes.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="consultation-button">
          <button onClick={openModal}>Получить консультацию</button>
        </div>
        <div className={`modal ${isModalOpen ? 'modal--open' : ''}`} onClick={closeModal}>
          <div className="main__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h2>Спасибо за вашу заявку!</h2>
            <p>Мы получили вашу контактную информацию. Наши консультанты свяжутся с вами в ближайшее время.</p>
          </div>
        </div>
      </div>
      <img className="consultation__plus" src="/images/expertsPlus.png" alt="" />
    </div>
  );
}

export default AppConsultation;
