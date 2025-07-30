export const getAuthHeaders = () => {
  const api_key = sessionStorage.getItem('api_key');
  const api_secret = sessionStorage.getItem('api_secret');

  if (!api_key || !api_secret) {
    throw new Error('Missing API credentials');
  }

  return {
    Authorization: `token ${api_key}:${api_secret}`,
  };
};
