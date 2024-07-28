import React, { useState } from 'react';
import axios from 'axios';
import './adminModal.css';

const AdminModal = ({ isOpen, onClose, auth }) => {
  const [activeSection, setActiveSection] = useState('registration');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState(['']);
  const [carData, setCarData] = useState({
    name: '',
    price: '',
    seats: '',
    body: '',
    fuel: '',
    lot: '',
    mileage: '',
    auction: '',
    year: '',
    color: '',
    engine: '',
    drive: '',
    transmission: '',
    state: '',
    owners: '',
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null
  });
  const [carError, setCarError] = useState('');
  const [carSuccess, setCarSuccess] = useState('');
  const [reviewData, setReviewData] = useState({
    userName: '',
    reviewDate: '',
    reviewText: ''
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const [leftConsultantData, setLeftConsultantData] = useState({
    name: '',
    title: '',
    photo: null
  });
  const [rightConsultantData, setRightConsultantData] = useState({
    name: '',
    title: '',
    photo: null
  });
  const [consultantError, setConsultantError] = useState('');
  const [consultantSuccess, setConsultantSuccess] = useState('');

  const handleEquipmentChange = (index, event) => {
    const newEquipment = [...equipment];
    newEquipment[index] = event.target.value;
    setEquipment(newEquipment);
  };

  const handleAddEquipment = () => {
    setEquipment([...equipment, '']);
  };

  const handleRemoveEquipment = (index) => {
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    setEquipment(newEquipment);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCarData({ ...carData, [name]: files[0] });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleLeftConsultantChange = (e) => {
    const { name, value } = e.target;
    setLeftConsultantData({ ...leftConsultantData, [name]: value });
  };

  const handleRightConsultantChange = (e) => {
    const { name, value } = e.target;
    setRightConsultantData({ ...rightConsultantData, [name]: value });
  };

  const handleLeftConsultantFileChange = (e) => {
    const { name, files } = e.target;
    setLeftConsultantData({ ...leftConsultantData, [name]: files[0] });
  };

  const handleRightConsultantFileChange = (e) => {
    const { name, files } = e.target;
    setRightConsultantData({ ...rightConsultantData, [name]: files[0] });
  };

  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');
    if (!registerEmail || !registerPassword) {
      setRegisterError('Пожалуйста, заполните все поля.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `http://78.27.236.115:8000/users/register`,
        { email: registerEmail, password: registerPassword },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
  
      setLoading(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterSuccess('Админ успешно создан');
    } catch (error) {
      setLoading(false);
      setRegisterError('Ошибка создания админа');
    }
  };
  
  const handleDelete = async () => {
    setDeleteError('');
    setDeleteSuccess('');
    if (!deleteEmail) {
      setDeleteError('Пожалуйста, введите email.');
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`http://78.27.236.115:8000/users/deleteEmail`, {
        params: { email: deleteEmail },
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setLoading(false);
      setDeleteEmail('');
      setDeleteSuccess('Админ успешно удален');
    } catch (error) {
      setLoading(false);
      setDeleteError('Ошибка удаления админа');
    }
  };

  const handleCarSubmit = async () => {
    setCarError('');
    setCarSuccess('');
    if (!carData.name || !carData.price) {
      setCarError('Пожалуйста, заполните обязательные поля.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Object.keys(carData).forEach(key => {
      formData.append(key, carData[key]);
    });
    formData.append('equipment', JSON.stringify(equipment));

    try {
      await axios.post(`http://78.27.236.115:8000/car/`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      setCarSuccess('Автомобиль успешно добавлен');
      setCarData({
        name: '',
        price: '',
        seats: '',
        body: '',
        fuel: '',
        lot: '',
        mileage: '',
        auction: '',
        year: '',
        color: '',
        engine: '',
        drive: '',
        transmission: '',
        state: '',
        owners: '',
        photo1: null,
        photo2: null,
        photo3: null,
        photo4: null
      });
      setEquipment(['']);
    } catch (error) {
      setLoading(false);
      setCarError('Ошибка добавления автомобиля');
    }
  };

  const handleReviewSubmit = async () => {
    setReviewError('');
    setReviewSuccess('');
    const { userName, reviewDate, reviewText } = reviewData;
    if (!userName || !reviewDate || !reviewText) {
      setReviewError('Пожалуйста, заполните все поля.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`http://78.27.236.115:8000/reviews/add`, {
        name: userName,
        date: reviewDate,
        text: reviewText
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setLoading(false);
      setReviewSuccess('Отзыв успешно добавлен');
      setReviewData({
        userName: '',
        reviewDate: '',
        reviewText: ''
      });
    } catch (error) {
      setLoading(false);
      setReviewError('Ошибка добавления отзыва');
    }
  };

  const handleLeftConsultantSubmit = async () => {
    setConsultantError('');
    setConsultantSuccess('');
    const { name, title, photo } = leftConsultantData;
    if (!name || !title || !photo) {
      setConsultantError('Пожалуйста, заполните все поля для левого консультанта.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('title', title);
    formData.append('photo', photo);

    try {
      await axios.put(`http://78.27.236.115:8000/consultants/left/1`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      setConsultantSuccess('Левый консультант успешно обновлен');
      setLeftConsultantData({
        name: '',
        title: '',
        photo: null
      });
    } catch (error) {
      setLoading(false);
      setConsultantError('Ошибка обновления левого консультанта');
    }
  };

  const handleRightConsultantSubmit = async () => {
    setConsultantError('');
    setConsultantSuccess('');
    const { name, title, photo } = rightConsultantData;
    if (!name || !title || !photo) {
      setConsultantError('Пожалуйста, заполните все поля для правого консультанта.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('title', title);
    formData.append('photo', photo);

    try {
      await axios.put(`http://78.27.236.115:8000/consultants/right/1`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      setConsultantSuccess('Правый консультант успешно обновлен');
      setRightConsultantData({
        name: '',
        title: '',
        photo: null
      });
    } catch (error) {
      setLoading(false);
      setConsultantError('Ошибка обновления правого консультанта');
    }
  };

  const handleClose = () => {
    setRegisterError('');
    setDeleteError('');
    setRegisterSuccess('');
    setDeleteSuccess('');
    setCarError('');
    setCarSuccess('');
    setReviewError('');
    setReviewSuccess('');
    setConsultantError('');
    setConsultantSuccess('');
    setRegisterEmail('');
    setRegisterPassword('');
    setDeleteEmail('');
    setCarData({
      name: '',
      price: '',
      seats: '',
      body: '',
      fuel: '',
      lot: '',
      mileage: '',
      auction: '',
      year: '',
      color: '',
      engine: '',
      drive: '',
      transmission: '',
      state: '',
      owners: '',
      photo1: null,
      photo2: null,
      photo3: null,
      photo4: null
    });
    setReviewData({
      userName: '',
      reviewDate: '',
      reviewText: ''
    });
    setLeftConsultantData({
      name: '',
      title: '',
      photo: null
    });
    setRightConsultantData({
      name: '',
      title: '',
      photo: null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={handleClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={handleClose}>&times;</button>
        <h2>Админ Панель</h2>
        <div className="admin-modal-menu">
          <button onClick={() => setActiveSection('registration')}>Зарегистрировать или удалить админов</button>
          <button onClick={() => setActiveSection('addCar')}>Добавить авто в каталог</button>
          <button onClick={() => setActiveSection('addReview')}>Добавить отзывы</button>
          <button onClick={() => setActiveSection('editConsultants')}>Изменить консультантов</button>
        </div>
        <div className="admin-modal-body">
          {activeSection === 'registration' && (
            <div>
              <h1>Регистрация и удаление админов</h1>
              <div className='admin-modal-body__register'>
                <p>Создать админа</p>
                <div className='admin-modal-body__register-login'>
                  <input type="text" placeholder="Введите email админа" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                <div className='admin-modal-body__register-password'>
                  <input type="password" placeholder="Введите пароль админа" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                </div>
                {registerError && <p className="error-message">{registerError}</p>}
                {registerSuccess && <p className="success-message">{registerSuccess}</p>}
                <button onClick={handleRegister} disabled={loading}>{loading ? 'Загрузка...' : 'Создать'}</button>
              </div>
              <div className='admin-modal-body__register admin-modal-body__register-delete'>
                <p>Удалить админа</p>
                <div className='admin-modal-body__register-login'>
                  <input type="text" placeholder="Введите email админа" value={deleteEmail} onChange={(e) => setDeleteEmail(e.target.value)} />
                </div>
                {deleteError && <p className="error-message">{deleteError}</p>}
                {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
                <button onClick={handleDelete} disabled={loading}>{loading ? 'Загрузка...' : 'Удалить'}</button>
              </div>
            </div>
          )}
          {activeSection === 'addCar' && (
            <div className='admin-modal-body__addCar'>
              <div className='admin-modal-body__addCar-withoutContacts'>
                <h1>Добавить автомобиль в каталог</h1>
                <div className='admin-modal-body__addCar-img'><input type="file" accept="image/*" name="photo1" onChange={handleFileChange} /></div>
                <div><input type="text" placeholder="Название" name="name" value={carData.name} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Цена" name="price" value={carData.price} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Количество мест" name="seats" value={carData.seats} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Тип кузова" name="body" value={carData.body} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Вид топлива" name="fuel" value={carData.fuel} onChange={handleInputChange} /></div>
              </div>
              <div className='admin-modal-body__addCar-withContacts'>
                <div className='admin-modal-body__addCar-img'><input type="file" accept="image/*" name="photo2" onChange={handleFileChange} /></div>
                <div className='admin-modal-body__addCar-img'><input type="file" accept="image/*" name="photo3" onChange={handleFileChange} /></div>
                <div className='admin-modal-body__addCar-img'><input type="file" accept="image/*" name="photo4" onChange={handleFileChange} /></div>
                <div className='admin-modal-body__addCar-img'><input type="file" accept="image/*" name="photo5" onChange={handleFileChange} /></div>
                <div><input type="text" placeholder="Номер лота" name="lot" value={carData.lot} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Старт аукциона" name="auction" value={carData.auction} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Пробег" name="mileage" value={carData.mileage} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Год выпуска" name="year" value={carData.year} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Цвет" name="color" value={carData.color} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Объем двигателя" name="engine" value={carData.engine} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Привод" name="drive" value={carData.drive} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Тип коробки передач" name="transmission" value={carData.transmission} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Состояние авто" name="state" value={carData.state} onChange={handleInputChange} /></div>
                <div><input type="text" placeholder="Количество владельцев" name="owners" value={carData.owners} onChange={handleInputChange} /></div>
                <div>
                  {equipment.map((item, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder="Комплектация"
                        value={item}
                        onChange={(event) => handleEquipmentChange(index, event)}
                      />
                      <div className="admin-modal__addCar-button"><button type="button" onClick={() => handleRemoveEquipment(index)}>Удалить</button></div>
                    </div>
                  ))}
                  <div className="admin-modal__addCar-buttonTwo"><button type="button" onClick={handleAddEquipment}>Добавить комплектацию</button></div>
                </div>
                {carError && <p className="error-message">{carError}</p>}
                {carSuccess && <p className="success-message">{carSuccess}</p>}
                <button className='admin-modal-body__addCar-button' onClick={handleCarSubmit} disabled={loading}>{loading ? 'Загрузка...' : 'Добавить в каталог'}</button>
              </div>
            </div>
          )}
          {activeSection === 'addReview' && (
            <div className='admin-modal-body__addReview'>
              <h1>Добавить отзыв</h1>
              <div><input type="text" placeholder="Имя юзера" name="userName" value={reviewData.userName} onChange={handleReviewChange} /></div>
              <div><input type="text" placeholder="Дата добавления отзыва" name="reviewDate" value={reviewData.reviewDate} onChange={handleReviewChange} /></div>
              <div>
                <textarea
                    placeholder="Отзыв"
                    name="reviewText"
                    value={reviewData.reviewText}
                    onChange={handleReviewChange}
                  ></textarea>
              </div>
              {reviewError && <p className="error-message">{reviewError}</p>}
              {reviewSuccess && <p className="success-message">{reviewSuccess}</p>}
              <button onClick={handleReviewSubmit} disabled={loading}>{loading ? 'Загрузка...' : 'Добавить отзыв'}</button>
            </div>
          )}
          {activeSection === 'editConsultants' && (
            <div className='admin-modal-body__addConsultation'>
              <h1>Изменить консультантов</h1>
              {consultantError && <p className="error-message">{consultantError}</p>}
              {consultantSuccess && <p className="success-message">{consultantSuccess}</p>}
              <div className='admin-modal-body__addConsultation-card'>
                <div className='left__consultation'>
                  <div className='admin-modal-body__addConsultation-img'>
                    <input type="file" accept="image/*" name="photo" onChange={handleLeftConsultantFileChange} />
                  </div>
                  <input type="text" placeholder="Имя левого консультанта" name="name" value={leftConsultantData.name} onChange={handleLeftConsultantChange} />
                  <input type="text" placeholder="Должность левого консультанта" name="title" value={leftConsultantData.title} onChange={handleLeftConsultantChange} />
                  <div>
                    <button onClick={handleLeftConsultantSubmit} disabled={loading}>{loading ? 'Загрузка...' : 'Изменить'}</button>
                  </div>
                </div>

                <div className='right__consultation'>
                  <div className='admin-modal-body__addConsultation-img'>
                    <input type="file" accept="image/*" name="photo" onChange={handleRightConsultantFileChange} />
                  </div>
                  <input type="text" placeholder="Имя правого консультанта" name="name" value={rightConsultantData.name} onChange={handleRightConsultantChange} />
                  <input type="text" placeholder="Должность правого консультанта" name="title" value={rightConsultantData.title} onChange={handleRightConsultantChange} />
                  <div>
                    <button onClick={handleRightConsultantSubmit} disabled={loading}>{loading ? 'Загрузка...' : 'Изменить'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
