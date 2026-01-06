import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken, isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";
import styles from "./Navbar.module.scss";
import logo from "../../assets/logoCar.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => ({ isLoggedIn: isAuthenticated(), isAdmin: isAdmin() }));

  useEffect(() => {
    const unsubscribe = subscribeAuthChange(() => setAuthState({ isLoggedIn: isAuthenticated(), isAdmin: isAdmin() }));
    return unsubscribe;
  }, []);

  const handleAuthClick = () => {
    if (authState.isLoggedIn) {
      clearAuthToken();
      navigate("/");
      return;
    }
    navigate("/auth");
  };

  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src={logo} alt="AutoDeal logo" />
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
        <div className={styles.actions}>
          {authState.isLoggedIn && authState.isAdmin && (
            <button
              className={styles.car_finder}
              onClick={() => {
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
      </nav>
    </header>
  );
};

export default Navbar;
