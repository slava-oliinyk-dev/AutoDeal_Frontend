import { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div>logo</div>
      <ul className={styles.menu}>
        <li>Home</li>
        <li>Catalog</li>
        <li>Reviews</li>
        <li>Contacts</li>
        <li>Consultation</li>
      </ul>
      <button>Подбор авто</button>
    </nav>
  );
};

export default Navbar;
