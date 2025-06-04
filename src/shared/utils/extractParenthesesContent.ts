export function extractParenthesesContent(str: string): string | null {
  const start = str.indexOf('(');
  if (start === -1) return null;

  let depth = 0;

  for (let i = start; i < str.length; i++) {
    if (str[i] === '(') {
      depth++;
    } else if (str[i] === ')') {
      depth--;
    }

    if (depth === 0) {
      return str.slice(start + 1, i);
    }
  }

  return null;
}
