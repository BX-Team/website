export default defineEventHandler(event => {
  if (getMethod(event) !== 'POST' || !event.path.startsWith('/api/')) {
    return;
  }

  const apiKey = getRequestHeader(event, 'x-api-key');
  const expectedKey = process.env.API_SECRET_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
});
