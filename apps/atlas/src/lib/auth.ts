export function verifyApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.API_SECRET_KEY;

  if (!expectedKey) {
    console.warn('API_SECRET_KEY is not set in environment variables');
    return false;
  }

  return apiKey === expectedKey;
}
