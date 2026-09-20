import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SchoolYear = {
  id: string;
  title: string;
  status: string;
};

type SchoolYearContextValue = {
  years: SchoolYear[];
  current: SchoolYear | null;
  currentId: string | null;
  setCurrentId: (id: string) => void;
  loading: boolean;
};

const SchoolYearContext = createContext<SchoolYearContextValue | null>(null);

export function SchoolYearProvider({ children }: { children: React.ReactNode }) {
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [currentId, setCurrentIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await (supabase as any)
        .from("school_years")
        .select("id,title,status")
        .order("created_at", { ascending: false });

      if (!active) return;
      const rows = (data ?? []) as SchoolYear[];
      setYears(rows);

      const stored = typeof window !== "undefined" ? window.localStorage.getItem("pisipouk.schoolYearId") : null;
      const next = rows.find((y) => y.id === stored)?.id ?? rows.find((y) => y.status === "active")?.id ?? rows[0]?.id ?? null;
      setCurrentIdState(next);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const setCurrentId = (id: string) => {
    setCurrentIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem("pisipouk.schoolYearId", id);
  };

  const current = useMemo(() => years.find((y) => y.id === currentId) ?? null, [years, currentId]);

  return (
    <SchoolYearContext.Provider value={{ years, current, currentId, setCurrentId, loading }}>
      {children}
    </SchoolYearContext.Provider>
  );
}

export function useSchoolYear() {
  const ctx = useContext(SchoolYearContext);
  if (!ctx) throw new Error("useSchoolYear must be used within SchoolYearProvider");
  return ctx;
}
