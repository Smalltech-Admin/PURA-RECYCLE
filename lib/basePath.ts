const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path: string): string {
  if (!BASE_PATH || path.startsWith('http')) return path;
  return `${BASE_PATH}${path}`;
}
