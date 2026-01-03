import { useEffect, useMemo, useState } from "react";
import styles from "./AdminPanel.module.scss";
import { isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";
import { getLeads, type Lead } from "../api/leads.api";

const AdminPanel = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const hasAccess = useMemo(() => authState.authed && authState.admin, [authState.authed, authState.admin]);

  useEffect(() => {
    if (!hasAccess) {
      setLeads([]);
      return;
    }

    let cancelled = false;

    const loadLeads = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getLeads();
        if (!cancelled) setLeads(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadLeads();

    return () => {
      cancelled = true;
    };
  }, [hasAccess]);

  const renderCar = (l: Lead) => {
    return l.carTitle ?? ([l.carMake, l.carBody, l.carBudget].filter(Boolean).join(" / ") || "-");
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>

          {hasAccess && (
            <button
              className={styles.refresh}
              type="button"
              onClick={async () => {
                try {
                  setLoading(true);
                  setError(null);
                  const data = await getLeads();
                  setLeads(data);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Error");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Refresh
            </button>
          )}
        </div>

        {!hasAccess ? (
          <div className={styles.withoutAccess}>You do not have permission to view this page.</div>
        ) : (
          <>
            {loading && <div className={styles.info}>Loading…</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.stats}>
              Total leads: <b>{leads.length}</b>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Consultant</th>
                    <th>Preferred time</th>
                    <th>Car</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td className={styles.type}>{l.type}</td>
                      <td>{l.email}</td>
                      <td>{l.name ?? "-"}</td>
                      <td>{l.consultant ?? "-"}</td>
                      <td>{l.preferredTime ?? "-"}</td>
                      <td>{renderCar(l)}</td>
                      <td>{new Date(l.createdAt).toLocaleString("de-DE")}</td>
                    </tr>
                  ))}

                  {!loading && leads.length === 0 && (
                    <tr>
                      <td className={styles.empty} colSpan={7}>
                        No leads yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
