export function isPromise<T = unknown>(input: unknown): input is Promise<T> {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as any).then === 'function'
  );
}
