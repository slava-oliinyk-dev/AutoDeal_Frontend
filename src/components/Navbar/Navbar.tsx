import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src="/images/logoCar.png" alt="AutoDeal logo" />
        </div>
        <ul className={styles.menu}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/catalog">Catalog</a>
          </li>
          <li>
            <a href="/reviews">Reviews</a>
          </li>
          <li>
            <a href="/contacts">Contacts</a>
          </li>
          <li>
            <a href="/consultation">Consultation</a>
          </li>
        </ul>
        <button className={styles.car_finder}>Car Finder</button>
      </nav>
    </header>
  );
};

export default Navbar;
