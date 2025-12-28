import { useState } from "react";
import { Modal } from "../Ui/Modal/Modal";
import styles from "./CarsCatalogFiltersModal.module.scss";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid", "Hydrogen"];
const transmissionOptions = ["Automatic", "Manual", "CVT", "Dual-Clutch", "Semi-Automatic"];
const bodyOptions = ["Sedan", "Hatchback", "Wagon", "SUV", "Coupe", "Convertible", "Minivan", "Pickup"];
const driveOptions = ["Front-wheel", "Rear-wheel", "All-wheel"];
const seatOptions = ["2", "4", "5", "6", "7", "8+"];
const colorOptions = ["Black", "White", "Gray", "Silver", "Blue", "Red", "Green", "Brown", "Beige", "Yellow", "Orange"];

type CheckboxCategory = "fuel" | "transmission" | "body" | "drive" | "seats" | "color";

const clampNumberValue = (value: string, min: number, max: number) => {
  if (value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "";
  return Math.min(max, Math.max(min, numeric)).toString();
};

type FilterState = {
  yearFrom: string;
  yearTo: string;
  mileageFrom: string;
  mileageTo: string;
  ownersFrom: string;
  ownersTo: string;
  fuel: Record<string, boolean>;
  transmission: Record<string, boolean>;
  body: Record<string, boolean>;
  drive: Record<string, boolean>;
  seats: Record<string, boolean>;
  color: Record<string, boolean>;
};

const createCheckboxState = (options: string[]) => options.reduce<Record<string, boolean>>((acc, option) => ({ ...acc, [option]: false }), {});

const createInitialState = (): FilterState => ({
  yearFrom: "",
  yearTo: "",
  mileageFrom: "",
  mileageTo: "",
  ownersFrom: "",
  ownersTo: "",
  fuel: createCheckboxState(fuelOptions),
  transmission: createCheckboxState(transmissionOptions),
  body: createCheckboxState(bodyOptions),
  drive: createCheckboxState(driveOptions),
  seats: createCheckboxState(seatOptions),
  color: createCheckboxState(colorOptions),
});

const CarsCatalogFiltersModal = ({ open, onOpenChange }: Props) => {
  const [filters, setFilters] = useState<FilterState>(() => createInitialState());

  const toggleCheckbox = (category: CheckboxCategory, option: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: { ...prev[category], [option]: !prev[category][option] },
    }));
  };

  const handleReset = () => {
    setFilters(createInitialState());
  };

  const digitsOnly = (s: string) => s.replace(/\D/g, "");

  const clampOnBlur = (value: string, min: number, max: number) => {
    if (value === "") return "";
    const n = Number(value);
    if (Number.isNaN(n)) return "";
    return String(Math.min(max, Math.max(min, n)));
  };

  const getSelected = (record: Record<string, boolean>) =>
    Object.entries(record)
      .filter(([, checked]) => checked)
      .map(([key]) => key);

  const handleApply = async () => {
    const params = new URLSearchParams();
    if (filters.yearFrom) params.append("yearFrom", filters.yearFrom);
    if (filters.yearTo) params.append("yearTo", filters.yearTo);
    if (filters.mileageFrom) params.append("mileageFrom", filters.mileageFrom);
    if (filters.mileageTo) params.append("mileageTo", filters.mileageTo);
    if (filters.ownersFrom) params.append("ownersFrom", filters.ownersFrom);
    if (filters.ownersTo) params.append("ownersTo", filters.ownersTo);

    const selectedFuel = getSelected(filters.fuel);
    const selectedTransmission = getSelected(filters.transmission);
    const selectedBody = getSelected(filters.body);
    const selectedDrive = getSelected(filters.drive);
    const selectedSeats = getSelected(filters.seats);
    const selectedColor = getSelected(filters.color);

    if (selectedFuel.length) params.append("fuel", selectedFuel.join(","));
    if (selectedTransmission.length) params.append("transmission", selectedTransmission.join(","));
    if (selectedBody.length) params.append("body", selectedBody.join(","));
    if (selectedDrive.length) params.append("drive", selectedDrive.join(","));
    if (selectedSeats.length) params.append("seats", selectedSeats.join(","));
    if (selectedColor.length) params.append("color", selectedColor.join(","));

    const url = `/backend/api?${params.toString()}`;
    try {
      await fetch(url, { method: "GET" });
      console.log(params.toString());
    } catch (error) {
      console.error("Failed to send filters", error);
    }
    setFilters(createInitialState());
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Filters" contentClassName={styles.filtersContent} bodyClassName={styles.filtersBody} closeClassName={styles.closeBtn}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Year</h4>
        <div className={styles.row2}>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="From 2005"
            value={filters.yearFrom}
            onChange={(e) => {
              const raw = digitsOnly(e.target.value).slice(0, 4);
              setFilters((prev) => ({ ...prev, yearFrom: raw }));
            }}
            onBlur={() => {
              setFilters((prev) => ({
                ...prev,
                yearFrom: clampOnBlur(prev.yearFrom, 2005, 2026),
              }));
            }}
          />

          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="To 2026"
            value={filters.yearTo}
            onChange={(e) => {
              const raw = digitsOnly(e.target.value).slice(0, 4);
              setFilters((prev) => ({ ...prev, yearTo: raw }));
            }}
            onBlur={() => {
              setFilters((prev) => ({
                ...prev,
                yearTo: clampOnBlur(prev.yearTo, 2005, 2026),
              }));
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Mileage</h4>
        <div className={styles.row2}>
          <input
            className={styles.input}
            type="number"
            placeholder="From 0 km"
            inputMode="numeric"
            min={0}
            max={200000}
            value={filters.mileageFrom}
            onChange={(e) => {
              const value = clampNumberValue(e.target.value, 0, 200000);
              setFilters((prev) => ({ ...prev, mileageFrom: value }));
            }}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="To 200,000 km"
            inputMode="numeric"
            min={0}
            max={200000}
            value={filters.mileageTo}
            onChange={(e) => {
              const value = clampNumberValue(e.target.value, 0, 200000);
              setFilters((prev) => ({ ...prev, mileageTo: value }));
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Fuel Type</h4>
        <div className={styles.chips}>
          {fuelOptions.map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} checked={filters.fuel[v]} onChange={() => toggleCheckbox("fuel", v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Transmission</h4>
        <div className={styles.chips}>
          {transmissionOptions.map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} checked={filters.transmission[v]} onChange={() => toggleCheckbox("transmission", v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Body Type</h4>
        <div className={styles.chips}>
          {bodyOptions.map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} checked={filters.body[v]} onChange={() => toggleCheckbox("body", v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Drive Type</h4>
        <div className={styles.chips}>
          {driveOptions.map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} checked={filters.drive[v]} onChange={() => toggleCheckbox("drive", v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Seats</h4>
        <div className={styles.chips}>
          {seatOptions.map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} checked={filters.seats[v]} onChange={() => toggleCheckbox("seats", v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Color</h4>
        <div className={styles.chips}>
          {colorOptions.map((v) => (
            <label key={v} className={styles.chip}>
              <input type="checkbox" className={styles.check} checked={filters.color[v]} onChange={() => toggleCheckbox("color", v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Owners</h4>
        <div className={styles.row2}>
          <input
            className={styles.input}
            type="number"
            placeholder="From 1"
            inputMode="numeric"
            min={1}
            max={3}
            value={filters.ownersFrom}
            onChange={(e) => {
              const value = clampNumberValue(e.target.value, 1, 3);
              setFilters((prev) => ({ ...prev, ownersFrom: value }));
            }}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="To 3"
            inputMode="numeric"
            min={1}
            max={3}
            value={filters.ownersTo}
            onChange={(e) => {
              const value = clampNumberValue(e.target.value, 1, 3);
              setFilters((prev) => ({ ...prev, ownersTo: value }));
            }}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={handleReset}>
          Reset
        </button>
        <button type="button" className={styles.apply} onClick={handleApply}>
          Apply filters
        </button>
      </div>
    </Modal>
  );
};

export default CarsCatalogFiltersModal;
