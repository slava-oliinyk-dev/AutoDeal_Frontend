import { useEffect, useState } from "react";

export type Consultant = {
  id: string;
  name: string;
  role: string;
  photo: string;
};

const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";
const CONSULTANT_ENDPOINTS = [`${BACKEND}/consultants/right`, `${BACKEND}/consultants/left`];
let cachedConsultants: Consultant[] | null = null;
let pendingRequest: Promise<Consultant[]> | null = null;

export const fetchConsultants = async (): Promise<Consultant[]> => {
  if (cachedConsultants) return cachedConsultants;
  if (pendingRequest) return pendingRequest;

  pendingRequest = (async () => {
    try {
      const responses = await Promise.all(
        CONSULTANT_ENDPOINTS.map(async (url) => {
          const res = await fetch(url);
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Request failed: ${res.status}`);
          }

          const data = (await res.json()) as Consultant[];
          return data;
        })
      );

      const consultants = responses.flat().map((consultant, index) => ({
        id: consultant.id || consultant.name || `consultant-${index}`,
        name: consultant.name || "Consultant",
        role: consultant.role || "Consultant",
        photo: consultant.photo || "",
      }));

      cachedConsultants = consultants;
      return consultants;
    } finally {
      pendingRequest = null;
    }
  })();

  return pendingRequest;
};

export const useConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadConsultants = async () => {
      try {
        setIsLoading(true);
        const data = await fetchConsultants();

        if (active) {
          setConsultants(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load consultants");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadConsultants();

    return () => {
      active = false;
    };
  }, []);

  return { consultants, isLoading, error };
};
