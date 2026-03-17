import { useCallback, useEffect, useState } from "react";

/**
 * Generic data-fetching hook.
 *
 * Accepts any async function that resolves to TData.
 * Automatically fires on mount (unless `skip: true`) and exposes a manual
 * `refetch` function for imperative re-fetches.
 *
 * @example
 * const [{ data, loading, error }] = useFetch(fetchProducts);
 */
export const useFetch = <TData, TArgs extends Record<string, unknown> = Record<string, never>>(
  fetchFn: FetchFn<TArgs, TData>,
  optionalProps?: TUseFetchOptionalProps<TArgs>,
): TUseFetchResult<TData, TArgs> => {
  const { args, skip = false } = optionalProps ?? {};

  const [loading, setLoading] = useState(!skip);
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Flatten args into a stable dependency list for useCallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const argsDep = args ? Object.values(args) : [];

  const fetchData = useCallback(
    async (immediateArgs?: TArgs): Promise<TData | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFn((immediateArgs ?? args) as TArgs);
        setResult(data);
        return data;
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn, ...argsDep],
  );

  useEffect(() => {
    if (skip) return;
    void fetchData();
  }, [skip, fetchData]);

  return [{ data: result, loading, error }, fetchData];
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Any async function that accepts optional args and resolves to TData. */
export type FetchFn<TArgs, TData> = (args?: TArgs) => Promise<TData>;

export type TUseFetchResult<TData, TArgs> = [
  { data: TData | null; loading: boolean; error: Error | null },
  (args?: TArgs) => Promise<TData | null>,
];

export interface TUseFetchOptionalProps<TArgs> {
  args?: TArgs;
  skip?: boolean;
}
