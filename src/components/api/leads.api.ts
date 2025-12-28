const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

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

export const sendLead = async (input: SendLeadInput) => {
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

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
};
