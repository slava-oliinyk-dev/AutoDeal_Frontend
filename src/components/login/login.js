import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: false, password: false });
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const validateFields = () => {
    const errors = { email: false, password: false };
    let isValid = true;

    if (!email) {
      errors.email = true;
      isValid = false;
    }

    if (!password || password.length < 5) {
      errors.password = true;
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setError('Пожалуйста, введите логин и пароль. Пароль должен содержать не менее 5 символов.');
      return;
    }

    try {
      const response = await axios.post(`http://78.27.236.115:8000/users/login`, { email, password });
      const { jwt, role } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('role', role);
      setAuth({ token: jwt, role: role });
      setEmail(''); 
      setPassword('');
      navigate('/');
    } catch (err) {
      setError('Неправильный логин или пароль');
    }
  };

  return (
    <div className='login'>
      <div className="login-container">
        <h2>Авторизация</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className={validationErrors.email ? 'input-error' : ''}
              placeholder='Введите логин'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className={validationErrors.password ? 'input-error' : ''}
              placeholder='Введите пароль'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Войти</button>
        </form>
      </div>
      <div className='login__plus'><img src="./images/plus.png" alt="" /></div>
      <div className='login__light'><img src="./images/orangeLightTwo.png" alt="" /></div>
    </div>
  );
};

export default Login;
