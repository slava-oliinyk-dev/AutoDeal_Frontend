import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthToken, isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";
import styles from "./Navbar.module.scss";
import logo from "../../assets/logoCar.png";
import { createHomeNavigationHandler } from "../../utils/navigation";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authState, setAuthState] = useState(() => ({ isLoggedIn: isAuthenticated(), isAdmin: isAdmin() }));

  useEffect(() => {
    const unsubscribe = subscribeAuthChange(() => setAuthState({ isLoggedIn: isAuthenticated(), isAdmin: isAdmin() }));
    return unsubscribe;
  }, []);

  const handleAuthClick = () => {
    setIsMenuOpen(false);
    if (authState.isLoggedIn) {
      clearAuthToken();
      navigate("/");
      return;
    }
    navigate("/auth");
  };

  const handleSectionNavigation = createHomeNavigationHandler(navigate, location, () => setIsMenuOpen(false));
  const handleHomeClick = handleSectionNavigation("top");
  const handleSectionClick = (sectionId: string) => handleSectionNavigation(sectionId);

  return (
    <header>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src={logo} alt="AutoDeal logo" />
          </div>
          <button type="button" className={styles.burger} aria-label="Toggle navigation menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((prev) => !prev)}>
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={styles.menuWrapper}>
          <ul className={styles.menu}>
            <li>
              <a href="/" onClick={handleHomeClick}>
                Home
              </a>
            </li>
            <li>
              <a href="/catalog" onClick={() => setIsMenuOpen(false)}>
                Catalog
              </a>
            </li>
            <li>
              <a href="#reviews" onClick={handleSectionClick("review")}>
                Reviews
              </a>
            </li>
            <li>
              <a href="#consultation" onClick={handleSectionClick("consultation")}>
                Contacts
              </a>
            </li>
            <li>
              <a href="#question" onClick={handleSectionClick("question")}>
                Consultation
              </a>
            </li>
          </ul>
          <div className={styles.actions}>
            {authState.isLoggedIn && authState.isAdmin && (
              <button
                className={styles.car_finder}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/admin");
                }}
              >
                Admin panel
              </button>
            )}
            <button className={styles.car_finder} onClick={handleAuthClick}>
              {authState.isLoggedIn ? "Exit" : "Sign in"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
