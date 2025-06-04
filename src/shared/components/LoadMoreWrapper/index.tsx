import { Button } from '../Button';

type LoadMoreWrapperProps = {
  children: React.ReactNode;
  isError: boolean;
  isInitLoading: boolean;
  loadMore: () => Promise<void>;
  hasMore: boolean;
};

export function LoadMoreWrapper({
  children,
  isInitLoading,
  isError,
  loadMore,
  hasMore,
}: LoadMoreWrapperProps) {
  return (
    <>
      {children}
      {isError ? (
        <div className="grid items-center justify-center gap-2 text-center">
          <h4 className="text-[1.2rem]">Сталася помилка!</h4>
          <Button variant="secondary" size="small" onClick={loadMore}>
            Спробувати ще раз
          </Button>
        </div>
      ) : isInitLoading ? (
        <div className="text-center">Завантаження...</div>
      ) : (
        hasMore && (
          <div className="flex justify-center pt-7 sm:pt-16">
            <Button onClick={loadMore} className="max-w-[10rem] w-full">
              Далі
            </Button>
          </div>
        )
      )}
    </>
  );
}
