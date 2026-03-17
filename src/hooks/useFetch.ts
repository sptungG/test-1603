import { useCallback, useEffect, useState } from "react";

export const useFetch = <TError, TFetchFn extends FetchFn<any, any>, TData = TGetDataType<TFetchFn>, TArgs = TGetArgsType<TFetchFn>>(
  fetchFn: TFetchFn,
  optionalProps?: TUseFetchOptionalProps<TArgs>,
): TUseFetchResult<TError, TData, TArgs> => {
  const { args, skip = false } = optionalProps || {};

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  const useFetchArgsDeps = args ? Object.values(args) : [];

  const fetchData = useCallback(
    async (immediateArgs?: TArgs): Promise<TData | null> => {
      setLoading(true);

      try {
        const response = await fetchFn((immediateArgs || args) as TArgs);
        const result = (await response.json()) as TData;
        setResult(result);
        return result;
      } catch (e) {
        setError(e as TError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn, ...useFetchArgsDeps],
  );

  useEffect(() => {
    if (skip) {
      return;
    }

    void fetchData();
  }, [skip, fetchData]);

  return [{ data: result, loading, error }, fetchData];
};

export type FetchResponse<TData> = Promise<
  Response & {
    json: () => Promise<TData>;
  }
>;

//
//
//

export type TUseFetchResult<TError, TData, TArgs> = [
  { data?: TData | null; loading: boolean; error?: TError | null },
  (args?: TArgs) => Promise<TData | null>,
];

export type TGetArgsType<TFetchFn> = TFetchFn extends (args: infer ArgsType) => any ? ArgsType : never;

export type TGetDataType<TFetchFn> = TFetchFn extends (args: any) => FetchResponse<infer TData> ? TData : never;

export type FetchFn<TArgs extends Record<string, any>, TData> = (args: TArgs) => FetchResponse<TData>;

export interface TUseFetchOptionalProps<TArgs> {
  args?: TArgs;
  skip?: boolean;
}
