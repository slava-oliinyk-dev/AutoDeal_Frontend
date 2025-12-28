export type LeadType = "DISCOUNT_5" | "FREE_CONSULTATION" | "CAR_CONTACT" | "CONSULTANT_CONTACT" | "CAR_SEARCH";

export type SendLeadInput = {
  type: LeadType;
  email: string;
  name?: string;
  consultant?: string;
  time?: string;
  carMake?: string;
  carBody?: string;
  carBudget?: string;
};

export type Car = {
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

export const sendLead = async (input: SendLeadInput) => {
  const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";
  const payload = {
    type: input.type,
    email: input.email.trim(),
    name: input.name?.trim() || undefined,
    consultant: input.consultant || undefined,
    time: input.time || undefined,
    carMake: input.carMake || undefined,
    carBody: input.carBody || undefined,
    carBudget: input.carBudget || undefined,
  };

  const res = await fetch(`${BACKEND}/leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
};

export const getCars = async (params?: { limit?: number; offset?: number }) => {
  const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

  const url = new URL(`${BACKEND}/cars/`);
  if (params?.limit != null) url.searchParams.set("limit", String(params.limit));
  if (params?.offset != null) url.searchParams.set("offset", String(params.offset));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: Car[] = await res.json();
  return data;
};
