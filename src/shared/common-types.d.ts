export type Pagination<T> = {
    cursor: string | null;
    items: T[];
}