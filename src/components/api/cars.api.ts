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
