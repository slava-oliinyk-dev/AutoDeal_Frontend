import { useEffect, useMemo, useState } from "react";
import styles from "./AdminPanel.module.scss";
import { isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";
import { getLeads, type Lead } from "../api/leads.api";

const TABS = {
  LEADS: "leads",
  ADD_CAR: "addCar",
  TEST: "test",
} as const;

type TabKey = (typeof TABS)[keyof typeof TABS];

const AdminPanel = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>(TABS.LEADS);
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
        </div>

        {!hasAccess ? (
          <div className={styles.withoutAccess}>You do not have permission to view this page.</div>
        ) : (
          <>
            <div className={styles.tabs} role="tablist" aria-label="Admin panel tabs">
              <button type="button" role="tab" aria-selected={activeTab === TABS.LEADS} className={`${styles.tabButton} ${activeTab === TABS.LEADS ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(TABS.LEADS)}>
                Лиды
              </button>
              <button type="button" role="tab" aria-selected={activeTab === TABS.ADD_CAR} className={`${styles.tabButton} ${activeTab === TABS.ADD_CAR ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(TABS.ADD_CAR)}>
                Добавить автомобиль
              </button>
              <button type="button" role="tab" aria-selected={activeTab === TABS.TEST} className={`${styles.tabButton} ${activeTab === TABS.TEST ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(TABS.TEST)}>
                Тестовый таб
              </button>
            </div>

            {loading && <div className={styles.info}>Loading…</div>}
            {error && <div className={styles.error}>{error}</div>}

            {activeTab === TABS.LEADS && (
              <>
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

            {activeTab === TABS.ADD_CAR && (
              <div className={styles.form}>
                <p className={styles.formHint}>Fill in the car listing details. Photos are uploaded from your computer.</p>

                <label className={styles.formField}>
                  <span>Photos (up to 5)</span>
                  <input type="file" accept="image/*" multiple />
                  <small className={styles.formHelp}>Select multiple images (JPG/PNG/WebP).</small>
                </label>

                <label className={styles.formField}>
                  <span>Car name</span>
                  <input type="text" placeholder="e.g. Porsche 911 (992) Carrera GTS" />
                </label>

                <label className={styles.formField}>
                  <span>Price</span>
                  <input type="number" placeholder="e.g. 139900" />
                </label>

                <label className={styles.formField}>
                  <span>Status</span>
                  <select defaultValue="IN STOCK">
                    <option value="IN STOCK">IN STOCK</option>
                    <option value="SOLD">SOLD</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </label>

                <label className={styles.formField}>
                  <span>Lot</span>
                  <input type="text" placeholder="e.g. EU-SPORT-992-01421" />
                </label>

                <label className={styles.formField}>
                  <span>VIN</span>
                  <input type="text" placeholder="e.g. WP0AB2A920N21S2Q3456" />
                </label>

                <label className={styles.formField}>
                  <span>Year</span>
                  <input type="number" placeholder="e.g. 2022" />
                </label>

                <label className={styles.formField}>
                  <span>Mileage (km)</span>
                  <input type="number" placeholder="e.g. 18500" />
                </label>

                <label className={styles.formField}>
                  <span>Body type</span>
                  <input type="text" placeholder="e.g. Coupe" />
                </label>

                <label className={styles.formField}>
                  <span>Seats</span>
                  <input type="number" placeholder="e.g. 4" />
                </label>

                <label className={styles.formField}>
                  <span>Fuel</span>
                  <input type="text" placeholder="e.g. Petrol" />
                </label>

                <label className={styles.formField}>
                  <span>Engine</span>
                  <input type="text" placeholder="e.g. 3.0T" />
                </label>

                <label className={styles.formField}>
                  <span>Drive</span>
                  <input type="text" placeholder="e.g. RWD" />
                </label>

                <label className={styles.formField}>
                  <span>Transmission</span>
                  <input type="text" placeholder="e.g. Automatic" />
                </label>

                <label className={styles.formField}>
                  <span>Color</span>
                  <input type="text" placeholder="e.g. Grey" />
                </label>

                <label className={styles.formField}>
                  <span>Country</span>
                  <input type="text" placeholder="e.g. Germany" />
                </label>

                <label className={styles.formField}>
                  <span>State / Region</span>
                  <input type="text" placeholder="e.g. Bavaria" />
                </label>

                <label className={styles.formField}>
                  <span>City</span>
                  <input type="text" placeholder="e.g. Munich" />
                </label>

                <label className={styles.formField}>
                  <span>Owners</span>
                  <input type="number" placeholder="e.g. 1" />
                </label>

                <label className={styles.formField}>
                  <span>Auction / Source</span>
                  <input type="text" placeholder="e.g. Dealer stock" />
                </label>

                <label className={styles.formField}>
                  <span>Equipment</span>
                  <textarea rows={3} placeholder="e.g. ABS, ESP, Sport Chrono, Heated Seats..." />
                  <small className={styles.formHelp}>Enter items separated by commas.</small>
                </label>

                <label className={styles.formField}>
                  <span>Description</span>
                  <textarea rows={4} placeholder="Write a short description..." />
                </label>
                <button className={styles.buttonAdd}>Add</button>
              </div>
            )}

            {activeTab === TABS.TEST && <div className={styles.testTab}>Произвольный контент для тестовой вкладки.</div>}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
