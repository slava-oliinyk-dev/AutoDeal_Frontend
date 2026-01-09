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
  photos: File[];
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

  const formData = new FormData();
  const appendIfPresent = (key: string, value?: string | null) => {
    if (value && value.trim()) {
      formData.append(key, value.trim());
    }
  };

  input.photos.slice(0, 5).forEach((file, index) => {
    formData.append(`photo${index + 1}`, file);
  });

  formData.append("name", input.name.trim());
  formData.append("price", input.price.trim());
  appendIfPresent("seats", input.seats);
  appendIfPresent("body", input.body);
  appendIfPresent("fuel", input.fuel);
  appendIfPresent("lot", input.lot);
  appendIfPresent("mileage", input.mileage);
  appendIfPresent("auction", input.auction);
  appendIfPresent("year", input.year);
  appendIfPresent("color", input.color);
  appendIfPresent("engine", input.engine);
  appendIfPresent("drive", input.drive);
  appendIfPresent("transmission", input.transmission);
  appendIfPresent("state", input.state);
  appendIfPresent("owners", input.owners);
  appendIfPresent("vin", input.vin);
  appendIfPresent("description", input.description);
  appendIfPresent("status", input.status);
  appendIfPresent("country", input.country);
  appendIfPresent("city", input.city);

  const equipment = input.equipment?.map((item) => item.trim()).filter(Boolean);
  if (equipment && equipment.length > 0) {
    equipment.forEach((item) => formData.append("equipment[]", item));
  }

  const res = await fetch(`${BACKEND}/cars/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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
export const deleteCarById = async (id: string | number) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${BACKEND}/cars/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
};
