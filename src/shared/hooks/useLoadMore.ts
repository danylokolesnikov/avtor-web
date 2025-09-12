import { useCallback, useState, useEffect, useMemo } from 'react';
import { Pagination } from '../common-types';
import { TypedLazyQueryTrigger } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/query';

type LoadMoreParams<Args> = {
  params?: Omit<Args, 'cursor'>;
  deps?: any[];
};

export function useLoadMore<
  QueryArg extends { cursor?: string | undefined } & Record<string, any>,
  ResultType extends Pagination<any>,
  BaseQuery extends BaseQueryFn,
  Lazy extends TypedLazyQueryTrigger<ResultType, QueryArg, BaseQuery>,
  Args extends Parameters<Lazy>[0],
>(
  lazy: Lazy,
  { params = {} as Omit<Args, 'cursor'>, deps = [] }: LoadMoreParams<Args>,
) {
  const [itemsMap, setItemsMap] = useState<
    Map<string, NonNullable<Awaited<ReturnType<Lazy>>['data']>['items']>
  >(new Map());
  const [cursor, setCursor] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const res = await lazy({ ...params, cursor } as Args);

      if (res.data) {
        const items = res.data.items;
        setIsError(false);
        setItemsMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(String(cursor), items);
          return newMap;
        });
        setCursor(res.data.cursor);
      } else {
        setIsError(true);
      }
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [lazy, params, cursor, isLoading]);

  useEffect(() => {
    setItemsMap(new Map());
    setCursor(null);
    loadMore();
  }, deps);

  const items = useMemo(() => Array.from(itemsMap.values()).flat(), [itemsMap]);

  return {
    items,
    loadMore,
    hasMore: !!cursor,
    isLoading,
    isError,
  };
}
