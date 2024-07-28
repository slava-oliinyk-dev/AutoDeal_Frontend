import React, { useState } from 'react';
import './navBar.css';
import AdminModal from '../adminModal/adminModal';

const AppNav = ({ auth, setAuth }) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth({ token: null, role: null });
  };

  const openAdminModal = () => {
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
  };

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <div className="navBar">
      <div className="navBar-content">
        <div className="navBar__logo">
          <a href="#home"><img src="/images/logo.png" alt="Logo" className="navBar__logo-logo" /></a>
        </div>
        <div className="navBar__menu">
          <a href="#home">
            <p>Главная</p>
          </a>
          <a href="#catalog">
            <p>Каталог</p>
          </a>
          <a href="#reviews">
            <p>Отзывы</p>
          </a>
          <a href="#contacts">
            <p>Контакты</p>
          </a>
          <a href="#consultation">
            <p>Консультация</p>
          </a>
          {auth.role === 'ADMIN' && (
            <>
              <a href="#admin" onClick={openAdminModal} className="admin-panel-link">
                <p>Админ Панель</p>
              </a>
              <a href="#logout" onClick={handleLogout} className="logout-link">
                <p>Выход из аккаунта</p>
              </a>
            </>
          )}
        </div>
        <div className="navBar__mobile">
          <a href="#selection">
            <p>Подбор авто</p>
          </a>
          <div className="navBar__burger" onClick={toggleBurgerMenu}>
            <div className={`burger-icon ${isBurgerOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <div className={`navBar__mobile-menu ${isBurgerOpen ? 'open' : ''}`}>
        <a href="#home" onClick={toggleBurgerMenu}>
          <p>Главная</p>
        </a>
        <a href="#catalog" onClick={toggleBurgerMenu}>
          <p>Каталог</p>
        </a>
        <a href="#reviews" onClick={toggleBurgerMenu}>
          <p>Отзывы</p>
        </a>
        <a href="#contacts" onClick={toggleBurgerMenu}>
          <p>Контакты</p>
        </a>
        <a href="#consultation" onClick={toggleBurgerMenu}>
          <p>Консультация</p>
        </a>
        {auth.role === 'ADMIN' && (
          <>
            <a href="#admin" onClick={() => { openAdminModal(); toggleBurgerMenu(); }} className="admin-panel-link">
              <p>Админ Панель</p>
            </a>
            <a href="#logout" onClick={handleLogout} className="logout-link">
              <p>Выход из аккаунта</p>
            </a>
          </>
        )}
      </div>
      <AdminModal isOpen={isAdminModalOpen} onClose={closeAdminModal} auth={auth} />
    </div>
  );
};

export default AppNav;
