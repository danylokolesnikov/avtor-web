import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useNextQueryParams = <T extends readonly string[]>(
  ...keys: T
): Record<T[number], string | undefined> => {
  const { asPath } = useRouter();

  const value = useMemo(() => {
    return keys.reduce(
      (acc, key) => {
        const match = asPath.match(new RegExp(`[?&]${key}=([^&]*)`));
        if (match) {
          acc[key] = decodeURIComponent(match[1]);
        }
        return acc;
      },
      {} as Record<string, string | undefined>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, ...keys]);

  return value as Record<T[number], string | undefined>;
};
