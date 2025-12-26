export type LeadType = "DISCOUNT_5" | "FREE_CONSULTATION" | "CAR_CONTACT" | "CONSULTANT_CONTACT" | "CAR_SEARCH";

export type SendLeadInput = {
  type: LeadType;
  email: string;
  name?: string;
  consultant?: string;
  time?: string;
};

export const sendLead = async (input: SendLeadInput) => {
  const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";
  const payload = {
    type: input.type,
    email: input.email.trim(),
    name: input.name?.trim() || undefined,
    consultant: input.consultant || undefined,
    time: input.time || undefined,
  };

  const res = await fetch(`${BACKEND}/leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
};
