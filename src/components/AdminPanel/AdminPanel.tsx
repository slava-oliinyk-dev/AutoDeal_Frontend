import { useEffect, useMemo, useState } from "react";
import styles from "./AdminPanel.module.scss";
import { isAdmin, isAuthenticated, subscribeAuthChange } from "../../utils/auth";
import { getLeads, type Lead } from "../api/leads.api";
import { CarsApiError, createCar } from "../api/cars.api";
import { updateConsultant, type ConsultantPosition } from "../api/consultants.api";

const TABS = {
  LEADS: "leads",
  ADD_CAR: "addCar",
  CONSULTANTS: "consultants",
} as const;

type TabKey = (typeof TABS)[keyof typeof TABS];

type CarFormState = {
  name: string;
  price: string;
  seats: string;
  body: string;
  fuel: string;
  lot: string;
  mileage: string;
  auction: string;
  year: string;
  color: string;
  engine: string;
  drive: string;
  transmission: string;
  state: string;
  owners: string;
  equipment: string;
  vin: string;
  description: string;
  status: string;
  country: string;
  city: string;
};

type CarFormField = keyof CarFormState | "photos";
type CarFormErrors = Partial<Record<CarFormField, string>>;

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = CURRENT_YEAR + 1;

const initialCarFormState = (): CarFormState => ({
  name: "",
  price: "",
  seats: "",
  body: "",
  fuel: "",
  lot: "",
  mileage: "",
  auction: "",
  year: "",
  color: "",
  engine: "",
  drive: "",
  transmission: "",
  state: "",
  owners: "",
  equipment: "",
  vin: "",
  description: "",
  status: "IN STOCK",
  country: "",
  city: "",
});

const numericFieldLabels: Record<"year" | "mileage" | "seats" | "owners", string> = {
  year: "Year",
  mileage: "Mileage",
  seats: "Seats",
  owners: "Owners",
};

const digitsOnly = (value: string) => value.replace(/\D+/g, "");
const decimalOnly = (value: string) => value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
const trimOrUndefined = (value: string) => value.trim() || undefined;

const parsePositiveDecimal = (value: string) => {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseNonNegativeInt = (value: string) => {
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const formatFieldName = (field: string) => {
  const normalized = field.replace(/\[\]/g, "").replace(/_/g, " ").trim();
  if (!normalized) return "Field";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getCreateCarFieldErrors = (error: CarsApiError): CarFormErrors => {
  const nextErrors: CarFormErrors = {};
  const entries = Object.entries(error.details);

  entries.forEach(([rawField, messages]) => {
    if (!messages.length) return;

    const normalizedField = rawField === "equipment[]" ? "equipment" : rawField;
    if (normalizedField === "photo" || normalizedField === "photo1") {
      nextErrors.photos = messages[0];
      return;
    }

    if (normalizedField in initialCarFormState()) {
      nextErrors[normalizedField as keyof CarFormState] = messages[0];
    }
  });

  return nextErrors;
};

const validateCarForm = (formState: CarFormState, photoFiles: File[]): CarFormErrors => {
  const errors: CarFormErrors = {};
  const price = formState.price.trim();
  const year = formState.year.trim();
  const mileage = formState.mileage.trim();
  const seats = formState.seats.trim();
  const owners = formState.owners.trim();
  const vin = formState.vin.trim().toUpperCase();
  const name = formState.name.trim();

  if (photoFiles.length === 0) {
    errors.photos = "Добавьте хотя бы одну фотографию автомобиля.";
  }

  if (!name) {
    errors.name = "Введите название автомобиля.";
  } else if (name.length < 2) {
    errors.name = "Название должно содержать минимум 2 символа.";
  } else if (name.length > 120) {
    errors.name = "Название слишком длинное — максимум 120 символов.";
  }

  if (!price) {
    errors.price = "Введите цену автомобиля.";
  } else {
    const parsedPrice = parsePositiveDecimal(price);
    if (parsedPrice == null) {
      errors.price = "Цена должна быть числом. Используйте только цифры и, при необходимости, точку для копеек.";
    } else if (parsedPrice <= 0) {
      errors.price = "Цена должна быть больше 0.";
    }
  }

  (["year", "mileage", "seats", "owners"] as const).forEach((field) => {
    const rawValue = formState[field].trim();
    if (!rawValue) return;

    const parsedValue = parseNonNegativeInt(rawValue);
    if (parsedValue == null) {
      errors[field] = `${numericFieldLabels[field]} должно содержать только целые числа.`;
    }
  });

  if (!errors.year && year) {
    const parsedYear = Number(year);
    if (parsedYear < 1900 || parsedYear > MAX_YEAR) {
      errors.year = `Год должен быть в диапазоне от 1900 до ${MAX_YEAR}.`;
    }
  }

  if (!errors.mileage && mileage) {
    const parsedMileage = Number(mileage);
    if (parsedMileage > 2_000_000) {
      errors.mileage = "Пробег выглядит некорректно. Укажите значение до 2 000 000 км.";
    }
  }

  if (!errors.seats && seats) {
    const parsedSeats = Number(seats);
    if (parsedSeats < 1 || parsedSeats > 99) {
      errors.seats = "Количество мест должно быть от 1 до 99.";
    }
  }

  if (!errors.owners && owners) {
    const parsedOwners = Number(owners);
    if (parsedOwners > 99) {
      errors.owners = "Количество владельцев должно быть не больше 99.";
    }
  }

  if (vin) {
    if (vin.length < 10 || vin.length > 17) {
      errors.vin = "VIN должен содержать от 10 до 17 символов.";
    } else if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) {
      errors.vin = "VIN может содержать только латинские буквы и цифры без I, O и Q.";
    }
  }

  return errors;
};

const AdminPanel = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>(TABS.LEADS);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<CarFormErrors>({});
  const [authState, setAuthState] = useState(() => ({
    authed: isAuthenticated(),
    admin: isAdmin(),
  }));
  const [consultantForm, setConsultantForm] = useState<{
    position: ConsultantPosition;
    name: string;
    title: string;
    photo: File | null;
  }>({
    position: "right",
    name: "",
    title: "",
    photo: null,
  });
  const [consultantSubmitting, setConsultantSubmitting] = useState(false);
  const [consultantSuccess, setConsultantSuccess] = useState<string | null>(null);
  const [consultantError, setConsultantError] = useState<string | null>(null);
  const [formState, setFormState] = useState<CarFormState>(initialCarFormState);

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

    void loadLeads();

    return () => {
      cancelled = true;
    };
  }, [hasAccess]);

  const renderCar = (l: Lead) => {
    return l.carTitle ?? ([l.carMake, l.carBody, l.carBudget].filter(Boolean).join(" / ") || "-");
  };

  const resetForm = () => {
    setFormState(initialCarFormState());
    setPhotoFiles([]);
    setFieldErrors({});
    setFormError(null);
  };

  const setFormField = (field: keyof CarFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
    setFormSuccess(null);
  };

  const handlePhotosChange = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).slice(0, 5);
    setFormError(null);
    setFormSuccess(null);
    setFieldErrors((prev) => ({ ...prev, photos: undefined }));
    setPhotoFiles(selected);
  };

  const validateConsultantForm = () => {
    const name = consultantForm.name.trim();
    const title = consultantForm.title.trim();

    if (!name && !title && !consultantForm.photo) return "Fill at least one field to update";
    if (name && name.length < 2) return "Name must be at least 2 characters long";
    if (name && name.length > 80) return "Name is too long (max 80 characters)";
    if (title && title.length < 2) return "Title must be at least 2 characters long";
    if (title && title.length > 120) return "Title is too long (max 120 characters)";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const validationErrors = validateCarForm(formState, photoFiles);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError("Проверьте форму: исправьте поля с ошибками и попробуйте снова.");
      return;
    }

    const equipmentList = formState.equipment
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      await createCar({
        photos: photoFiles,
        name: formState.name,
        price: formState.price,
        seats: trimOrUndefined(formState.seats),
        body: trimOrUndefined(formState.body),
        fuel: trimOrUndefined(formState.fuel),
        lot: trimOrUndefined(formState.lot),
        mileage: trimOrUndefined(formState.mileage),
        auction: trimOrUndefined(formState.auction),
        year: trimOrUndefined(formState.year),
        color: trimOrUndefined(formState.color),
        engine: trimOrUndefined(formState.engine),
        drive: trimOrUndefined(formState.drive),
        transmission: trimOrUndefined(formState.transmission),
        state: trimOrUndefined(formState.state),
        owners: trimOrUndefined(formState.owners),
        equipment: equipmentList,
        vin: trimOrUndefined(formState.vin)?.toUpperCase(),
        description: trimOrUndefined(formState.description),
        status: trimOrUndefined(formState.status),
        country: trimOrUndefined(formState.country),
        city: trimOrUndefined(formState.city),
      });

      setFormSuccess("Автомобиль успешно добавлен.");
      resetForm();
    } catch (e) {
      if (e instanceof CarsApiError) {
        const apiFieldErrors = getCreateCarFieldErrors(e);
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
        }

        const fallbackMessage = e.status >= 500 ? "Бэкенд не смог сохранить автомобиль. Попробуйте еще раз чуть позже." : "Не удалось сохранить автомобиль. Проверьте данные формы.";
        const detailSummary = Object.entries(e.details)
          .flatMap(([field, messages]) => messages.map((message) => `${formatFieldName(field)}: ${message}`))
          .join(" ");

        setFormError(detailSummary || e.message || fallbackMessage);
      } else {
        setFormError(e instanceof Error ? e.message : "Failed to send data");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsultantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultantError(null);
    setConsultantSuccess(null);

    const validationError = validateConsultantForm();
    if (validationError) {
      setConsultantError(validationError);
      return;
    }

    try {
      setConsultantSubmitting(true);
      await updateConsultant(consultantForm.position, {
        name: consultantForm.name.trim() || undefined,
        title: consultantForm.title.trim() || undefined,
        photo: consultantForm.photo,
      });

      setConsultantSuccess("Consultant updated successfully.");
      setConsultantForm((prev) => ({ ...prev, name: "", title: "", photo: null }));
    } catch (e) {
      setConsultantError(e instanceof Error ? e.message : "Failed to update consultant");
    } finally {
      setConsultantSubmitting(false);
    }
  };

  const renderFieldError = (field: CarFormField) => {
    const message = fieldErrors[field];
    if (!message) return null;

    return (
      <small className={styles.fieldError} role="alert">
        {message}
      </small>
    );
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
                Leads
              </button>
              <button type="button" role="tab" aria-selected={activeTab === TABS.ADD_CAR} className={`${styles.tabButton} ${activeTab === TABS.ADD_CAR ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(TABS.ADD_CAR)}>
                Add a vehicle
              </button>
              <button type="button" role="tab" aria-selected={activeTab === TABS.CONSULTANTS} className={`${styles.tabButton} ${activeTab === TABS.CONSULTANTS ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(TABS.CONSULTANTS)}>
                Consultants
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
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <p className={styles.formHint}>Fill in the vehicle details. Photos are uploaded from your computer.</p>

                {formError && <div className={styles.error}>{formError}</div>}
                {formSuccess && <div className={styles.success}>{formSuccess}</div>}

                <label className={styles.formField}>
                  <span>Photos (up to 5)</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => handlePhotosChange(e.target.files)} aria-invalid={Boolean(fieldErrors.photos)} />
                  {photoFiles.length > 0 && <small className={styles.formHelp}>Files selected: {photoFiles.length}</small>}
                  {renderFieldError("photos")}
                </label>

                <label className={styles.formField}>
                  <span>Vehicle name</span>
                  <input type="text" placeholder="For example, Porsche 911 (992) Carrera GTS" value={formState.name} onChange={(e) => setFormField("name", e.target.value)} aria-invalid={Boolean(fieldErrors.name)} />
                  {renderFieldError("name")}
                </label>

                <label className={styles.formField}>
                  <span>Price</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="For example, 139900"
                    value={formState.price}
                    onChange={(e) => setFormField("price", decimalOnly(e.target.value))}
                    aria-invalid={Boolean(fieldErrors.price)}
                  />
                  <small className={styles.formHelp}>Use only digits, optionally with a decimal point.</small>
                  {renderFieldError("price")}
                </label>

                <label className={styles.formField}>
                  <span>Status</span>
                  <select value={formState.status} onChange={(e) => setFormField("status", e.target.value)}>
                    <option value="IN STOCK">IN STOCK</option>
                    <option value="SOLD">SOLD</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </label>

                <label className={styles.formField}>
                  <span>Lot</span>
                  <input type="text" placeholder="For example, EU-SPORT-992-01421" value={formState.lot} onChange={(e) => setFormField("lot", e.target.value)} aria-invalid={Boolean(fieldErrors.lot)} />
                  {renderFieldError("lot")}
                </label>

                <label className={styles.formField}>
                  <span>VIN</span>
                  <input type="text" placeholder="For example, WP0AB2A920N21S2Q3456" value={formState.vin} onChange={(e) => setFormField("vin", e.target.value.toUpperCase())} aria-invalid={Boolean(fieldErrors.vin)} />
                  <small className={styles.formHelp}>10-17 Latin letters or digits, without I, O and Q.</small>
                  {renderFieldError("vin")}
                </label>

                <label className={styles.formField}>
                  <span>Year</span>
                  <input type="text" inputMode="numeric" placeholder="For example, 2022" value={formState.year} onChange={(e) => setFormField("year", digitsOnly(e.target.value))} aria-invalid={Boolean(fieldErrors.year)} />
                  <small className={styles.formHelp}>Allowed range: 1900-{MAX_YEAR}.</small>
                  {renderFieldError("year")}
                </label>

                <label className={styles.formField}>
                  <span>Mileage (km)</span>
                  <input type="text" inputMode="numeric" placeholder="For example, 18500" value={formState.mileage} onChange={(e) => setFormField("mileage", digitsOnly(e.target.value))} aria-invalid={Boolean(fieldErrors.mileage)} />
                  {renderFieldError("mileage")}
                </label>

                <label className={styles.formField}>
                  <span>Body type</span>
                  <input type="text" placeholder="For example, Coupe" value={formState.body} onChange={(e) => setFormField("body", e.target.value)} aria-invalid={Boolean(fieldErrors.body)} />
                  {renderFieldError("body")}
                </label>

                <label className={styles.formField}>
                  <span>Seats</span>
                  <input type="text" inputMode="numeric" placeholder="For example, 4" value={formState.seats} onChange={(e) => setFormField("seats", digitsOnly(e.target.value))} aria-invalid={Boolean(fieldErrors.seats)} />
                  {renderFieldError("seats")}
                </label>

                <label className={styles.formField}>
                  <span>Fuel</span>
                  <input type="text" placeholder="For example, Petrol" value={formState.fuel} onChange={(e) => setFormField("fuel", e.target.value)} aria-invalid={Boolean(fieldErrors.fuel)} />
                  {renderFieldError("fuel")}
                </label>

                <label className={styles.formField}>
                  <span>Engine</span>
                  <input type="text" placeholder="For example, 3.0T" value={formState.engine} onChange={(e) => setFormField("engine", e.target.value)} aria-invalid={Boolean(fieldErrors.engine)} />
                  {renderFieldError("engine")}
                </label>

                <label className={styles.formField}>
                  <span>Drivetrain</span>
                  <input type="text" placeholder="For example, RWD" value={formState.drive} onChange={(e) => setFormField("drive", e.target.value)} aria-invalid={Boolean(fieldErrors.drive)} />
                  {renderFieldError("drive")}
                </label>

                <label className={styles.formField}>
                  <span>Transmission</span>
                  <input type="text" placeholder="For example, Automatic" value={formState.transmission} onChange={(e) => setFormField("transmission", e.target.value)} aria-invalid={Boolean(fieldErrors.transmission)} />
                  {renderFieldError("transmission")}
                </label>

                <label className={styles.formField}>
                  <span>Color</span>
                  <input type="text" placeholder="For example, Grey" value={formState.color} onChange={(e) => setFormField("color", e.target.value)} aria-invalid={Boolean(fieldErrors.color)} />
                  {renderFieldError("color")}
                </label>

                <label className={styles.formField}>
                  <span>Country</span>
                  <input type="text" placeholder="For example, Germany" value={formState.country} onChange={(e) => setFormField("country", e.target.value)} aria-invalid={Boolean(fieldErrors.country)} />
                  {renderFieldError("country")}
                </label>

                <label className={styles.formField}>
                  <span>State / Region</span>
                  <input type="text" placeholder="For example, Bavaria" value={formState.state} onChange={(e) => setFormField("state", e.target.value)} aria-invalid={Boolean(fieldErrors.state)} />
                  {renderFieldError("state")}
                </label>

                <label className={styles.formField}>
                  <span>City</span>
                  <input type="text" placeholder="For example, Munich" value={formState.city} onChange={(e) => setFormField("city", e.target.value)} aria-invalid={Boolean(fieldErrors.city)} />
                  {renderFieldError("city")}
                </label>

                <label className={styles.formField}>
                  <span>Owners</span>
                  <input type="text" inputMode="numeric" placeholder="For example, 1" value={formState.owners} onChange={(e) => setFormField("owners", digitsOnly(e.target.value))} aria-invalid={Boolean(fieldErrors.owners)} />
                  {renderFieldError("owners")}
                </label>

                <label className={styles.formField}>
                  <span>Auction / Source</span>
                  <input type="text" placeholder="For example, Dealer stock" value={formState.auction} onChange={(e) => setFormField("auction", e.target.value)} aria-invalid={Boolean(fieldErrors.auction)} />
                  {renderFieldError("auction")}
                </label>

                <label className={styles.formField}>
                  <span>Equipment</span>
                  <textarea rows={3} placeholder="For example, ABS, ESP, Sport Chrono, Heated Seats..." value={formState.equipment} onChange={(e) => setFormField("equipment", e.target.value)} aria-invalid={Boolean(fieldErrors.equipment)} />
                  <small className={styles.formHelp}>List items separated by commas.</small>
                  {renderFieldError("equipment")}
                </label>

                <label className={styles.formField}>
                  <span>Description</span>
                  <textarea rows={4} placeholder="Short description..." value={formState.description} onChange={(e) => setFormField("description", e.target.value)} aria-invalid={Boolean(fieldErrors.description)} />
                  {renderFieldError("description")}
                </label>
                <button className={styles.buttonAdd} type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Add"}
                </button>
              </form>
            )}

            {activeTab === TABS.CONSULTANTS && (
              <form className={`${styles.form} ${styles.consultantTab}`} onSubmit={handleConsultantSubmit}>
                <p className={styles.formHint}>Update consultant details. Leave empty fields to keep current values.</p>
                {consultantError && <div className={styles.error}>{consultantError}</div>}
                {consultantSuccess && <div className={styles.success}>{consultantSuccess}</div>}

                <label className={styles.formField}>
                  <span>Select consultant</span>
                  <select
                    value={consultantForm.position}
                    onChange={(e) =>
                      setConsultantForm((s) => ({
                        ...s,
                        position: e.target.value as ConsultantPosition,
                      }))
                    }
                  >
                    <option value="right">Right consultant</option>
                    <option value="left">Left consultant</option>
                  </select>
                </label>

                <label className={styles.formField}>
                  <span>Name</span>
                  <input type="text" placeholder="Enter name" value={consultantForm.name} onChange={(e) => setConsultantForm((s) => ({ ...s, name: e.target.value }))} />
                  <small className={styles.formHelp}>2-80 characters.</small>
                </label>

                <label className={styles.formField}>
                  <span>Title</span>
                  <input type="text" placeholder="Enter title" value={consultantForm.title} onChange={(e) => setConsultantForm((s) => ({ ...s, title: e.target.value }))} />
                  <small className={styles.formHelp}>2-120 characters.</small>
                </label>

                <label className={styles.formField}>
                  <span>Photo</span>
                  <input type="file" accept="image/*" onChange={(e) => setConsultantForm((s) => ({ ...s, photo: e.target.files?.[0] ?? null }))} />
                  <small className={styles.formHelp}>Optional. Replaces existing photo.</small>
                </label>

                <button className={styles.buttonAdd} type="submit" disabled={consultantSubmitting}>
                  {consultantSubmitting ? "Updating..." : "Update"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
