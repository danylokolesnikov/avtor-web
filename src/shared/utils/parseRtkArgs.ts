export function parseRtkArgs(args: string) {
  if (args === 'undefined') return undefined;
  if (args === 'null') return null;
  return JSON.parse(args);
}
