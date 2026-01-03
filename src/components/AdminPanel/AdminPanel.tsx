import { useEffect, useState } from "react";
import styles from "./AdminPanel.module.scss";
import { isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";

const AdminPanel = () => {
  const [authState, setAuthState] = useState(() => ({
    authed: isAuthenticated(),
    admin: isAdmin(),
  }));

  useEffect(() => {
    const unsubscribe = subscribeAuthChange(() =>
      setAuthState({
        authed: isAuthenticated(),
        admin: isAdmin(),
      })
    );

    return unsubscribe;
  }, []);

  const hasAccess = authState.authed && authState.admin;

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.message}>{hasAccess ? "Successful login" : "You do not have permission to view this page."}</p>
      </div>
    </section>
  );
};

export default AdminPanel;
