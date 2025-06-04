import { useCallback, useState, useEffect } from 'react';
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
  const [items, setItems] = useState<
    NonNullable<Awaited<ReturnType<Lazy>>['data']>['items'] | null
  >(null);
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
        setItems((prev) => (prev ? prev.concat(items) : items));
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
    setItems(null);
    setCursor(null);
    loadMore();
  }, deps);

  return {
    items,
    loadMore,
    setItems,
    hasMore: !!cursor,
    isLoading,
    isError,
  };
}
