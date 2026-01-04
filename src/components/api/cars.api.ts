import { getAuthToken } from "../../utils/auth";

const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type CarListItem = {
  id: string | number;
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  photo4?: string | null;
  photo5?: string | null;

  name?: string | null;
  description?: string | null;
  year?: string | number | null;
  mileage?: string | number | null;
  fuel?: string | null;
  transmission?: string | null;
  country?: string | null;
  city?: string | null;
  status?: string | null;
  price?: string | number | null;
};

export type CarDetails = {
  id: string | number;
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  photo4?: string | null;
  photo5?: string | null;

  name?: string | null;
  description?: string | null;
  year?: string | number | null;
  mileage?: string | number | null;
  fuel?: string | null;
  transmission?: string | null;
  country?: string | null;
  city?: string | null;
  status?: string | null;
  price?: string | number | null;

  seats?: string | null;
  body?: string | null;
  lot?: string | null;
  auction?: string | null;
  color?: string | null;
  engine?: string | null;
  drive?: string | null;
  state?: string | null;
  owners?: string | null;
  equipment?: string[] | null;
  vin?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CreateCarInput = {
  photos: string[];

  name: string;
  price: string;
  seats?: string;
  body?: string;
  fuel?: string;
  lot?: string;
  mileage?: string;
  auction?: string;
  year?: string;
  color?: string;
  engine?: string;
  drive?: string;
  transmission?: string;
  state?: string;
  owners?: string;
  equipment?: string[];
  vin?: string;
  description?: string;
  status?: string;
  country?: string;
  city?: string;
};

export const getCarById = (id: string | number) => {
  return fetchJson<CarDetails>(`${BACKEND}/cars/${id}`);
};

export const getCars = (params?: { limit?: number; offset?: number }) => {
  const url = new URL(`${BACKEND}/cars/`);
  if (params?.limit != null) url.searchParams.set("limit", String(params.limit));
  if (params?.offset != null) url.searchParams.set("offset", String(params.offset));
  return fetchJson<CarListItem[]>(url.toString());
};

export const getFilteredCars = (query: string) => {
  const url = `${BACKEND}/cars/filters${query ? `?${query}` : ""}`;
  return fetchJson<CarListItem[]>(url);
};

export const createCar = async (input: CreateCarInput) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token");

  const payload = {
    photo1: input.photos[0] || null,
    photo2: input.photos[1] || null,
    photo3: input.photos[2] || null,
    photo4: input.photos[3] || null,
    photo5: input.photos[4] || null,

    name: input.name.trim(),
    price: input.price.trim(),
    seats: input.seats?.trim() || undefined,
    body: input.body?.trim() || undefined,
    fuel: input.fuel?.trim() || undefined,
    lot: input.lot?.trim() || undefined,
    mileage: input.mileage?.trim() || undefined,
    auction: input.auction?.trim() || undefined,
    year: input.year?.trim() || undefined,
    color: input.color?.trim() || undefined,
    engine: input.engine?.trim() || undefined,
    drive: input.drive?.trim() || undefined,
    transmission: input.transmission?.trim() || undefined,
    state: input.state?.trim() || undefined,
    owners: input.owners?.trim() || undefined,
    equipment: input.equipment?.map((item) => item.trim()).filter(Boolean),
    vin: input.vin?.trim() || undefined,
    description: input.description?.trim() || undefined,
    status: input.status?.trim() || undefined,
    country: input.country?.trim() || undefined,
    city: input.city?.trim() || undefined,
  };

  const res = await fetch(`${BACKEND}/cars/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const text = await res.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text) as { id?: string | number };
  } catch {
    return null;
  }
};
