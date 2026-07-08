import { useState, useEffect } from "react";
import { getYearlyStreak } from "@/utils/api/progress/progress.api";
import type { IYearlyStreak } from "@/@types/interface/progress.interface";

export function useYearlyStreak() {
  const [data, setData] = useState<IYearlyStreak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getYearlyStreak()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
