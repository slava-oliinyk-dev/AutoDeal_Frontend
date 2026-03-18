import { getAuthToken } from "../../utils/auth";

const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

type ApiErrorDetails = Record<string, string[]>;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeErrorText = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
};

const collectErrorDetails = (payload: unknown): ApiErrorDetails => {
  if (!isRecord(payload)) return {};

  return Object.entries(payload).reduce<ApiErrorDetails>((acc, [key, value]) => {
    if (["message", "detail", "error", "errors", "statusCode"].includes(key)) return acc;

    if (Array.isArray(value)) {
      const messages = value.map((item) => normalizeErrorText(item)).filter((item): item is string => Boolean(item));
      if (messages.length > 0) acc[key] = messages;
      return acc;
    }

    const singleMessage = normalizeErrorText(value);
    if (singleMessage) acc[key] = [singleMessage];
    return acc;
  }, {});
};

const formatErrorPayload = (payload: unknown): { message: string | null; details: ApiErrorDetails } => {
  const directText = normalizeErrorText(payload);
  if (directText) return { message: directText, details: {} };

  if (Array.isArray(payload)) {
    const messages = payload.map((item) => normalizeErrorText(item)).filter((item): item is string => Boolean(item));
    return {
      message: messages.length > 0 ? messages.join(". ") : null,
      details: {},
    };
  }

  if (!isRecord(payload)) return { message: null, details: {} };

  const primaryMessage = normalizeErrorText(payload.message) ?? normalizeErrorText(payload.detail) ?? normalizeErrorText(payload.error);
  const nestedErrors = payload.errors;
  const details = {
    ...collectErrorDetails(payload),
    ...(nestedErrors ? collectErrorDetails(nestedErrors) : {}),
  };

  if (primaryMessage) {
    return { message: primaryMessage, details };
  }

  const detailLines = Object.entries(details).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`));

  return {
    message: detailLines.length > 0 ? detailLines.join(". ") : null,
    details,
  };
};

export class CarsApiError extends Error {
  status: number;
  details: ApiErrorDetails;

  constructor(message: string, status: number, details: ApiErrorDetails = {}) {
    super(message);
    this.name = "CarsApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseErrorResponse(res: Response, fallbackMessage: string) {
  const rawText = await res.text().catch(() => "");
  let payload: unknown = rawText;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = rawText;
    }
  }

  const { message, details } = formatErrorPayload(payload);
  return new CarsApiError(message || fallbackMessage, res.status, details);
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw await parseErrorResponse(res, `HTTP ${res.status}`);
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
    throw await parseErrorResponse(res, `Request failed: ${res.status}`);
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
    const fallbackMessage = res.status === 404 ? "This vehicle was not found or has already been deleted." : `Request failed: ${res.status}`;
    throw await parseErrorResponse(res, fallbackMessage);
  }
};
