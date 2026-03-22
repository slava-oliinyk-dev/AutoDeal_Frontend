import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Footer.module.scss";
import logo from "../../assets/logoCar.png";
import { createHomeNavigationHandler } from "../../utils/navigation";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleSectionNavigation = createHomeNavigationHandler(navigate, location);

  return (
    <footer className={styles.footer}>
      <div className={styles.line} />
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a className={styles.logoLink} href="/" onClick={handleSectionNavigation("top")}>
              <img className={styles.logo} src={logo} alt="AutoDeal logo" />
            </a>
          </div>

          <nav className={styles.col} aria-label="Footer menu">
            <h4 className={styles.title}>Menu</h4>
            <ul className={styles.list}>
              <li>
                <a className={styles.link} href="/" onClick={handleSectionNavigation("top")}>
                  Home
                </a>
              </li>
              <li>
                <Link className={styles.link} to="/catalog">
                  Catalog
                </Link>
              </li>
              <li>
                <a className={styles.link} href="#review" onClick={handleSectionNavigation("review")}>
                  Reviews
                </a>
              </li>
              <li>
                <a className={styles.link} href="#consultation" onClick={handleSectionNavigation("consultation")}>
                  Contacts
                </a>
              </li>
              <li>
                <a className={styles.link} href="#question" onClick={handleSectionNavigation("question")}>
                  Consultation
                </a>
              </li>
            </ul>
          </nav>

          <div className={styles.col}>
            <h4 className={styles.title}>Services</h4>
            <ul className={styles.list}>
              <li className={styles.item}>Expert Consultation</li>
              <li className={styles.item}>Get a free consultation</li>
              <li className={styles.item}>Car Selection</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <Link className={styles.link} to="/privacy-policy">
              Privacy Policy
            </Link>
            <span className={styles.dot}>•</span>
            <Link className={styles.link} to="/terms-and-conditions">
              Terms & Conditions
            </Link>
          </div>

          <div className={styles.copy}>© {new Date().getFullYear()} All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
