export function getPublicUrl(pathname: string): string {
  const base = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
  return base ? `${base}/${pathname}` : `https://files.bxteam.org/${pathname}`;
}
